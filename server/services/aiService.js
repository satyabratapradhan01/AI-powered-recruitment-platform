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
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest',
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
