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

/**
 * Analyze candidates for HR Job Candidate Matching using Gemini AI / Hybrid rule-based engine.
 * 
 * @param {Object} job - Job document (title, description, requiredSkills, preferredSkills, experienceRequired)
 * @param {Array} applications - Array of JobApplication documents populated with candidateId details
 * @returns {Promise<Array>} List of matched candidate analysis objects sorted by matchScore descending
 */
export const getCandidateMatchesForJob = async (job, applications) => {
  if (!applications || applications.length === 0) {
    return [];
  }

  const jobInfo = {
    title: job.title || '',
    company: job.company || '',
    description: (job.description || '').substring(0, 1000),
    requiredSkills: job.requiredSkills || [],
    preferredSkills: job.preferredSkills || [],
    experienceRequired: job.experienceRequired || '',
  };

  const computeBaselineMatch = (app) => {
    const candidate = app.candidateId || app.userId || {};
    const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
    const resumeText = app.resume?.parsedText || candidate.resume?.parsedText || '';
    const experience = Array.isArray(candidate.experience) ? candidate.experience : [];
    const education = Array.isArray(candidate.education) ? candidate.education : [];

    const required = (jobInfo.requiredSkills || []).map((s) => String(s).trim());
    const preferred = (jobInfo.preferredSkills || []).map((s) => String(s).trim());
    const allJobSkills = [...new Set([...required, ...preferred])];

    const normalizedCandidateSkills = candidateSkills.map((s) => String(s).toLowerCase().trim());
    const resumeTextLower = (resumeText || '').toLowerCase();

    const matchedSkills = [];
    const missingSkills = [];

    allJobSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      const isDirectMatch = normalizedCandidateSkills.some((cs) => cs.includes(sLower) || sLower.includes(cs));
      const isResumeMatch = resumeTextLower.includes(sLower);

      if (isDirectMatch || isResumeMatch) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const totalSkills = allJobSkills.length || 1;
    const matchRatio = matchedSkills.length / totalSkills;
    let score = Math.round(matchRatio * 70);

    const hasExp = experience && experience.length > 0;
    if (hasExp) score += 15;
    if (education && education.length > 0) score += 10;
    if (matchedSkills.length > 0) score += 5;

    score = Math.min(98, Math.max(25, app.atsScore || score));

    const experienceAlignment = hasExp
      ? `Candidate has ${experience.length} relevant professional role(s) aligned with ${jobInfo.experienceRequired || 'requirements'}.`
      : `Profile skills match role requirements; no formal work history listed.`;

    const explanation = matchedSkills.length > 0
      ? `Candidate demonstrates key required skills (${matchedSkills.slice(0, 3).join(', ')}). High alignment for ${jobInfo.title}.`
      : `Candidate has core technical foundation, with potential training opportunities in ${missingSkills.slice(0, 2).join(', ')}.`;

    return {
      applicationId: app._id,
      candidateId: candidate._id || candidate,
      candidateName: candidate.name || 'Candidate',
      candidateEmail: candidate.email || '',
      matchScore: score,
      matchedSkills,
      missingSkills,
      experienceAlignment,
      explanation,
      status: app.status,
      appliedAt: app.createdAt || app.appliedAt,
    };
  };

  const baselineMatches = applications.map(computeBaselineMatch);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return baselineMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  const candidatesForPrompt = applications.slice(0, 15).map((app, idx) => {
    const candidate = app.candidateId || app.userId || {};
    const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
    const resumeText = app.resume?.parsedText || candidate.resume?.parsedText || '';
    const experience = Array.isArray(candidate.experience) ? candidate.experience : [];
    const education = Array.isArray(candidate.education) ? candidate.education : [];

    const expSummary = experience
      .map((e) => `${e.title || ''} at ${e.company || ''} (${e.duration || ''})`)
      .filter(Boolean)
      .join('; ');

    const eduSummary = education
      .map((ed) => `${ed.degree || ''} in ${ed.fieldOfStudy || ed.field || ''}`)
      .filter(Boolean)
      .join('; ');

    return {
      index: idx,
      applicationId: app._id.toString(),
      candidateId: candidate._id ? candidate._id.toString() : String(idx),
      name: candidate.name || 'Candidate',
      skills: candidateSkills,
      experienceSummary: expSummary || 'None listed',
      educationSummary: eduSummary || 'None listed',
      resumeSnippet: resumeText.substring(0, 2000),
    };
  });

  const prompt = `You are an expert HR Talent Acquisition Assistant. Evaluate candidate applications against the specified job requirements.

Important Rules:
1. Base matching ONLY on technical skills, experience, education, and domain alignment.
2. DO NOT use sensitive personal attributes (age, gender, race, ethnicity, or location discrimination).
3. AI is purely an assistive tool. Output is for HR decision support only. Do NOT make final hiring, rejection, or selection decisions.

Job Requirements:
- Title: ${jobInfo.title}
- Description: ${jobInfo.description}
- Required Skills: ${jobInfo.requiredSkills.join(', ')}
- Preferred Skills: ${jobInfo.preferredSkills.join(', ')}
- Experience Required: ${jobInfo.experienceRequired}

Candidates to Evaluate:
${JSON.stringify(candidatesForPrompt, null, 2)}

Instructions:
Return MUST be ONLY a valid JSON array of evaluation objects for each candidate, matching EXACTLY this JSON structure:

[
  {
    "applicationId": "<applicationId>",
    "matchScore": <number 0-100 compatibility estimate>,
    "matchedSkills": [<array of string matching skills>],
    "missingSkills": [<array of string missing skills>],
    "experienceAlignment": "<1 sentence objective evaluation of experience alignment>",
    "explanation": "<2-3 sentence objective overview of candidate match strengths and gaps>"
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

      if (!response.ok) continue;

      const jsonResponse = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) continue;

      const cleanJsonStr = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const aiEvaluations = JSON.parse(cleanJsonStr);

      if (Array.isArray(aiEvaluations)) {
        const merged = baselineMatches.map((base) => {
          const aiItem = aiEvaluations.find(
            (item) => item.applicationId === base.applicationId.toString()
          );
          if (aiItem && typeof aiItem.matchScore === 'number') {
            return {
              ...base,
              matchScore: Math.min(100, Math.max(0, Math.round(aiItem.matchScore))),
              matchedSkills: Array.isArray(aiItem.matchedSkills) ? aiItem.matchedSkills.map(String) : base.matchedSkills,
              missingSkills: Array.isArray(aiItem.missingSkills) ? aiItem.missingSkills.map(String) : base.missingSkills,
              experienceAlignment: typeof aiItem.experienceAlignment === 'string' ? aiItem.experienceAlignment.trim() : base.experienceAlignment,
              explanation: typeof aiItem.explanation === 'string' ? aiItem.explanation.trim() : base.explanation,
            };
          }
          return base;
        });

        return merged.sort((a, b) => b.matchScore - a.matchScore);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[AI Service] Error matching candidates for job with model ${model}:`, err.message);
    }
  }

  return baselineMatches.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Generate AI-Powered Interview Preparation Questions (Technical, HR, Project, Role-Specific)
 * 
 * @param {Object} params
 * @param {string} params.jobTitle
 * @param {string} params.company
 * @param {string} params.jobDescription
 * @param {string} params.resumeText
 * @param {Array} params.candidateSkills
 * @returns {Promise<Object>} Categorized interview questions with suggested answer points
 */
export const generateInterviewPrepQuestions = async ({
  jobTitle = '',
  company = '',
  jobDescription = '',
  resumeText = '',
  candidateSkills = [],
}) => {
  const skillsStr = Array.isArray(candidateSkills) ? candidateSkills.join(', ') : String(candidateSkills || '');

  const createFallbackQuestions = () => ({
    technicalQuestions: [
      {
        id: 'tech-1',
        question: `What are the core architectural principles and technical stack requirements for a ${jobTitle || 'Software Engineer'} role?`,
        category: 'Technical',
        suggestedAnswerPoints: [
          'Explain component architecture and state management',
          'Discuss database design and RESTful API optimization',
          'Highlight error handling and code maintainability',
        ],
      },
      {
        id: 'tech-2',
        question: `How do you debug performance bottlenecks in backend services or databases under heavy traffic?`,
        category: 'Technical',
        suggestedAnswerPoints: [
          'Use profiling tools and execution plans (explain)',
          'Implement indexing and caching layers (e.g., Redis)',
          'Optimize database queries and async non-blocking execution',
        ],
      },
    ],
    hrQuestions: [
      {
        id: 'hr-1',
        question: `Why are you interested in joining ${company || 'our company'} for the ${jobTitle || 'target'} position?`,
        category: 'HR / Behavioral',
        suggestedAnswerPoints: [
          'Align company mission with personal career goals',
          'Highlight relevant domain background and technical passion',
          'Mention collaborative engineering culture',
        ],
      },
      {
        id: 'hr-2',
        question: `Describe a scenario where you experienced technical disagreement with team members and how you resolved it.`,
        category: 'HR / Behavioral',
        suggestedAnswerPoints: [
          'Use STAR method (Situation, Task, Action, Result)',
          'Emphasize data-driven decision making and benchmarks',
          'Focus on respectful communication and team alignment',
        ],
      },
    ],
    projectQuestions: [
      {
        id: 'proj-1',
        question: `Walk me through a key project from your resume/background that demonstrates your problem-solving capabilities.`,
        category: 'Project',
        suggestedAnswerPoints: [
          'Detail the project scope and problem statement',
          'Describe your specific contributions and technology choices',
          'Share measurable outcomes or performance metrics achieved',
        ],
      },
    ],
    roleSpecificQuestions: [
      {
        id: 'role-1',
        question: `How do you ensure system reliability, testing coverage, and smooth CI/CD deployment pipelines?`,
        category: 'Role-Specific',
        suggestedAnswerPoints: [
          'Implement unit, integration, and end-to-end automated testing',
          'Use CI/CD automation pipelines for continuous deployment',
          'Monitor application health and error logging in production',
        ],
      },
    ],
  });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return createFallbackQuestions();
  }

  const prompt = `You are an expert AI Technical Recruiter and Interview Preparation Coach. Generate a comprehensive, personalized set of interview preparation questions for a candidate applying for a position.

Target Role & Company:
- Job Title: ${jobTitle || 'N/A'}
- Company: ${company || 'N/A'}
- Job Description: ${(jobDescription || 'N/A').substring(0, 1500)}

Candidate Profile:
- Skills: ${skillsStr || 'N/A'}
- Resume Summary: ${(resumeText || 'N/A').substring(0, 3000)}

Instructions:
Generate 4 distinct categories of questions tailored to the candidate's resume and job requirements:
1. technicalQuestions (2 questions)
2. hrQuestions (2 questions)
3. projectQuestions (1-2 questions)
4. roleSpecificQuestions (1-2 questions)

Each question item MUST include:
- "id": string unique id
- "question": string question text
- "category": string category name
- "suggestedAnswerPoints": array of string bullet points detailing key hints and suggested answer structure

Return MUST be ONLY a valid JSON object matching EXACTLY this structure:
{
  "technicalQuestions": [ { "id": "t1", "question": "...", "category": "Technical", "suggestedAnswerPoints": ["..."] } ],
  "hrQuestions": [ { "id": "h1", "question": "...", "category": "HR / Behavioral", "suggestedAnswerPoints": ["..."] } ],
  "projectQuestions": [ { "id": "p1", "question": "...", "category": "Project", "suggestedAnswerPoints": ["..."] } ],
  "roleSpecificQuestions": [ { "id": "r1", "question": "...", "category": "Role-Specific", "suggestedAnswerPoints": ["..."] } ]
}`;

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

      if (!response.ok) continue;

      const jsonResponse = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJsonStr = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const parsed = JSON.parse(cleanJsonStr);
      if (
        Array.isArray(parsed.technicalQuestions) &&
        Array.isArray(parsed.hrQuestions) &&
        Array.isArray(parsed.projectQuestions) &&
        Array.isArray(parsed.roleSpecificQuestions)
      ) {
        return parsed;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[AI Service] Error generating interview questions with model ${model}:`, err.message);
    }
  }

  return createFallbackQuestions();
};

/**
 * Provide constructive AI feedback on a candidate's practice interview answer.
 * 
 * @param {Object} params
 * @param {string} params.question
 * @param {string} params.candidateAnswer
 * @param {Array} params.suggestedAnswerPoints
 * @param {string} params.jobTitle
 * @returns {Promise<Object>} Feedback object containing score, strengths, areasForImprovement, feedback, sampleImprovedAnswer
 */
export const evaluateInterviewAnswer = async ({
  question,
  candidateAnswer,
  suggestedAnswerPoints = [],
  jobTitle = '',
}) => {
  const createFallbackFeedback = () => ({
    score: 80,
    strengths: [
      'Directly addresses the question prompt',
      'Uses clear professional communication',
    ],
    areasForImprovement: [
      'Include specific technical metrics or STAR method details',
      'Elaborate further on trade-offs and alternative solutions',
    ],
    feedback: 'Good practice response! Try adding concrete examples and quantifiable achievements to make your answer even stronger.',
    sampleImprovedAnswer: `In my experience as a ${jobTitle || 'Software Engineer'}, I approach this by analyzing core requirements, evaluating system trade-offs, and implementing robust automated tests.`,
  });

  if (!candidateAnswer || !candidateAnswer.trim()) {
    return {
      score: 0,
      strengths: [],
      areasForImprovement: ['Please provide a written practice answer for evaluation.'],
      feedback: 'No answer provided. Please type your practice answer to receive AI feedback.',
      sampleImprovedAnswer: suggestedAnswerPoints.join('. '),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return createFallbackFeedback();
  }

  const hintsStr = Array.isArray(suggestedAnswerPoints) ? suggestedAnswerPoints.join('\n- ') : '';

  const prompt = `You are an expert AI Interview Coach. Evaluate the candidate's practice interview answer objectively and constructively.

Question: ${question}
Role Target: ${jobTitle || 'Target Position'}
Suggested Key Points / Guidelines:
- ${hintsStr}

Candidate's Written Practice Answer:
"""
${candidateAnswer}
"""

Instructions:
Provide constructive, encouraging feedback and return ONLY a valid JSON object matching EXACTLY this structure:
{
  "score": <number 0-100 evaluation of answer quality>,
  "strengths": [<array of 2-3 specific strength bullet points>],
  "areasForImprovement": [<array of 2-3 specific constructive improvement bullet points>],
  "feedback": "<2-3 sentence overview feedback encouraging the candidate>",
  "sampleImprovedAnswer": "<exemplary 3-4 sentence model answer tailored to the question>"
}`;

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

      if (!response.ok) continue;

      const jsonResponse = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJsonStr = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const parsed = JSON.parse(cleanJsonStr);
      if (typeof parsed.score === 'number' && typeof parsed.feedback === 'string') {
        return {
          score: Math.min(100, Math.max(0, Math.round(parsed.score))),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
          areasForImprovement: Array.isArray(parsed.areasForImprovement) ? parsed.areasForImprovement.map(String) : [],
          feedback: parsed.feedback.trim(),
          sampleImprovedAnswer: typeof parsed.sampleImprovedAnswer === 'string' ? parsed.sampleImprovedAnswer.trim() : '',
        };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[AI Service] Error evaluating interview answer with model ${model}:`, err.message);
    }
  }

  return createFallbackFeedback();
};
