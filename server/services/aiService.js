import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates and normalizes the ATS analysis output from Gemini AI.
 */
const validateATSOutput = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('AI output is not a valid JSON object');
  }

  // Ensure score is a valid integer between 0 and 100
  let score = 0;
  if (typeof data.score === 'number' && !isNaN(data.score)) {
    score = Math.min(100, Math.max(0, Math.round(data.score)));
  } else if (typeof data.score === 'string') {
    const parsedScore = parseInt(data.score, 10);
    if (!isNaN(parsedScore)) {
      score = Math.min(100, Math.max(0, parsedScore));
    }
  }

  return {
    score,
    matchedSkills: Array.isArray(data.matchedSkills) ? data.matchedSkills.map(String) : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills.map(String) : [],
    matchedKeywords: Array.isArray(data.matchedKeywords) ? data.matchedKeywords.map(String) : [],
    missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords.map(String) : [],
    experienceMatch: Boolean(data.experienceMatch),
    educationMatch: Boolean(data.educationMatch),
    suggestions: Array.isArray(data.suggestions) ? data.suggestions.map(String) : [],
    summary: typeof data.summary === 'string' ? data.summary.trim() : 'AI compatibility analysis completed.',
  };
};

/**
 * Safe fallback ATS result generator for error handling (empty resume, rate limits, timeouts, API failures).
 */

const createFallbackATSResult = (reason = 'Unable to complete AI analysis') => {
  return {
    score: 0,
    matchedSkills: [],
    missingSkills: [],
    matchedKeywords: [],
    missingKeywords: [],
    experienceMatch: false,
    educationMatch: false,
    suggestions: [
      'Please ensure your resume contains extractable text and resubmit.',
      'Highlight relevant skills and experiences aligned with the job description.',
    ],
    summary: `ATS Compatibility Estimate unavailable: ${reason}`,
  };
};

/**
 * Perform AI-powered ATS Analysis using Gemini AI API.
 * 
 * @param {Object} params
 * @param {string} params.resumeText - Extracted text from candidate resume
 * @param {string} params.jobDescription - Job posting description
 * @param {Array|string} params.requiredSkills - Required skills list
 * @param {Array|string} params.preferredSkills - Preferred skills list
 * @param {string} params.experienceRequired - Experience requirement string
 * @returns {Promise<Object>} Structured ATS analysis object
 */
export const analyzeResumeATS = async ({
  resumeText,
  jobDescription,
  requiredSkills = [],
  preferredSkills = [],
  experienceRequired = '',
}) => {
  // 1. Handle empty or missing resume text
  if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
    console.warn('[AI Service] Resume text is empty or missing.');
    return createFallbackATSResult('Resume text is empty or could not be extracted from document.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[AI Service] GEMINI_API_KEY is not configured in process.env.');
    return createFallbackATSResult('GEMINI_API_KEY environment variable is not configured.');
  }

  // Format skills lists safely
  const reqSkillsStr = Array.isArray(requiredSkills)
    ? requiredSkills.join(', ')
    : String(requiredSkills || '');
  const prefSkillsStr = Array.isArray(preferredSkills)
    ? preferredSkills.join(', ')
    : String(preferredSkills || '');

  const prompt = `You are an expert HR Applicant Tracking System (ATS) Analyzer. Analyze the candidate's resume against the target job posting details.

Target Job Requirements:
- Description: ${jobDescription || 'Not specified'}
- Required Skills: ${reqSkillsStr || 'Not specified'}
- Preferred Skills: ${prefSkillsStr || 'Not specified'}
- Required Experience: ${experienceRequired || 'Not specified'}

Candidate Resume Text:
"""
${resumeText.substring(0, 15000)}
"""

Important Rules:
1. Output score is an AI-powered compatibility estimate (0-100), NOT an official ATS score.
2. Do NOT automatically reject any candidate based on score.
3. Return MUST be ONLY a valid JSON object matching EXACTLY this structure with no surrounding commentary:

{
  "score": <number 0-100>,
  "matchedSkills": [<array of string matching skills>],
  "missingSkills": [<array of string missing required/preferred skills>],
  "matchedKeywords": [<array of string matching domain keywords>],
  "missingKeywords": [<array of string missing domain keywords>],
  "experienceMatch": <boolean true or false>,
  "educationMatch": <boolean true or false>,
  "suggestions": [<array of string actionable improvements>],
  "summary": "<2-3 sentence overview of candidate match and key strengths/gaps>"
}`;

  // Sequence of Gemini models to attempt
  const models = [
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
  ];

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      // Handle Rate Limits (HTTP 429)
      if (response.status === 429) {
        console.warn(`[AI Service] Rate limit encountered on model ${model}. Attempting fallback...`);
        continue;
      }

      // Handle Other Non-200 API Failures
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error(`[AI Service] Gemini API returned HTTP ${response.status} for model ${model}:`, errText);
        continue;
      }

      const jsonResponse = await response.json();
      const rawOutput = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawOutput) {
        console.warn(`[AI Service] Gemini API model ${model} returned empty content.`);
        continue;
      }

      // Sanitize JSON text to remove any markdown code block wrappers
      const cleanJsonStr = rawOutput
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const parsedJson = JSON.parse(cleanJsonStr);
      return validateATSOutput(parsedJson);

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.warn(`[AI Service] Request timed out (15s limit) for model ${model}.`);
      } else if (error instanceof SyntaxError) {
        console.error(`[AI Service] Malformed JSON output from Gemini model ${model}:`, error.message);
      } else {
        console.error(`[AI Service] Error querying Gemini model ${model}:`, error.message);
      }
    }
  }

  // If all models failed, timed out, or returned invalid outputs, return fallback
  return createFallbackATSResult('AI service API request failed or timed out across all available endpoints.');
};

/**
 * Helper to compute skill overlaps and keyword matching between candidate and a job.
 */
const evaluateJobMatchRuleBased = (candidateSkills, resumeText, candidateExp, candidateEdu, job) => {
  const normalizedCandidateSkills = candidateSkills.map((s) => String(s).toLowerCase().trim());
  const resumeTextLower = (resumeText || '').toLowerCase();

  const required = (job.requiredSkills || []).map((s) => String(s).trim());
  const preferred = (job.preferredSkills || []).map((s) => String(s).trim());
  const allJobSkills = [...new Set([...required, ...preferred])];

  const matchingSkills = [];
  const missingSkills = [];

  allJobSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    const isDirectSkillMatch = normalizedCandidateSkills.some((cs) => cs.includes(sLower) || sLower.includes(cs));
    const isResumeTextMatch = resumeTextLower.includes(sLower);

    if (isDirectSkillMatch || isResumeTextMatch) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const totalSkills = allJobSkills.length || 1;
  const matchRatio = matchingSkills.length / totalSkills;

  let score = Math.round(matchRatio * 75);
  if (candidateExp && candidateExp.length > 0) score += 10;
  if (candidateEdu && candidateEdu.length > 0) score += 10;
  if (matchingSkills.length > 0) score += 5;

  score = Math.min(98, Math.max(25, score));

  const explanation = matchingSkills.length > 0
    ? `Strong match with candidate skills: ${matchingSkills.join(', ')}. Candidate's profile aligns with job requirements for ${job.title} at ${job.company}.`
    : `Potential career alignment role matching candidate's overall profile for ${job.title}.`;

  return {
    job,
    matchScore: score,
    matchingSkills,
    missingSkills,
    explanation,
  };
};

/**
 * Generate AI-Powered Personalized Job Recommendations using Gemini AI.
 * 
 * @param {Object} candidateUser - User document containing profile, skills, education, experience, resume
 * @param {Array} activeJobs - Array of active Job documents from database
 * @returns {Promise<Array>} List of recommendation objects sorted by matchScore descending
 */
export const getJobRecommendations = async (candidateUser, activeJobs) => {
  if (!activeJobs || activeJobs.length === 0) {
    return [];
  }

  const candidateSkills = Array.isArray(candidateUser?.skills) ? candidateUser.skills : [];
  const resumeText = candidateUser?.resume?.parsedText || '';
  const education = Array.isArray(candidateUser?.education) ? candidateUser.education : [];
  const experience = Array.isArray(candidateUser?.experience) ? candidateUser.experience : [];

  const baselineRecommendations = activeJobs.map((job) =>
    evaluateJobMatchRuleBased(candidateSkills, resumeText, experience, education, job)
  );

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return baselineRecommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  const expSummary = experience
    .map((e) => `${e.title || ''} at ${e.company || ''} (${e.duration || ''})`)
    .filter(Boolean)
    .join('; ');
  const eduSummary = education
    .map((ed) => `${ed.degree || ''} in ${ed.fieldOfStudy || ed.field || ''} from ${ed.institution || ed.school || ''}`)
    .filter(Boolean)
    .join('; ');

  const candidateSummary = `
Skills: ${candidateSkills.join(', ') || 'Not specified'}
Experience: ${expSummary || 'Not specified'}
Education: ${eduSummary || 'Not specified'}
Resume Text Summary: ${resumeText.substring(0, 4000) || 'None'}
`;

  const jobsForPrompt = activeJobs.slice(0, 15).map((j, idx) => ({
    index: idx,
    id: j._id.toString(),
    title: j.title,
    company: j.company,
    description: (j.description || '').substring(0, 500),
    requiredSkills: j.requiredSkills || [],
    preferredSkills: j.preferredSkills || [],
    experienceRequired: j.experienceRequired || '',
  }));

  const prompt = `You are an AI Career Advisor & Job Matchmaker. Compare candidate background against job postings and generate personalized, explainable job recommendations.

DO NOT use any sensitive personal attributes (such as age, gender, ethnicity, or location discrimination). Base match purely on technical skills, experience, education, and domain alignment.

Candidate Profile:
${candidateSummary}

Available Job Postings:
${JSON.stringify(jobsForPrompt, null, 2)}

Instructions:
Return MUST be ONLY a valid JSON array of recommendation objects for the provided jobs, matching EXACTLY this JSON structure:

[
  {
    "id": "<job id>",
    "matchScore": <number 0-100 compatibility estimate>,
    "matchingSkills": [<array of string matching skills>],
    "missingSkills": [<array of string missing skills>],
    "explanation": "<2-3 sentence objective explanation of why this job matches candidate profile>"
  }
]`;

  const models = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash'];

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const jsonResponse = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) continue;

      const cleanJsonStr = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const aiRecommendations = JSON.parse(cleanJsonStr);

      if (Array.isArray(aiRecommendations)) {
        const merged = activeJobs.map((job) => {
          const aiItem = aiRecommendations.find((item) => item.id === job._id.toString() || item.id === job.id);
          if (aiItem && typeof aiItem.matchScore === 'number') {
            return {
              job,
              matchScore: Math.min(100, Math.max(0, Math.round(aiItem.matchScore))),
              matchingSkills: Array.isArray(aiItem.matchingSkills) ? aiItem.matchingSkills.map(String) : [],
              missingSkills: Array.isArray(aiItem.missingSkills) ? aiItem.missingSkills.map(String) : [],
              explanation: typeof aiItem.explanation === 'string' ? aiItem.explanation.trim() : 'AI compatibility match calculated.',
            };
          }
          return evaluateJobMatchRuleBased(candidateSkills, resumeText, experience, education, job);
        });

        return merged.sort((a, b) => b.matchScore - a.matchScore);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[AI Service] Error generating recommendations with model ${model}:`, err.message);
    }
  }

  return baselineRecommendations.sort((a, b) => b.matchScore - a.matchScore);
};
