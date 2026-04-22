import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-flash-latest',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

const callAI = async (prompt, maxTokens = 4096) => {
  try {
    console.log(`🤖 Calling Gemini with ${prompt.length} chars...`);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    console.log('✅ Gemini response received, length:', text.length);

    // Parse JSON — handle cases where model wraps in backticks
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
};

// ─── 1. Resume Analysis ─────────────────────────────────────────────────────

export const analyseResume = async (resumeText, jobDescription) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyse the given resume against the job description and provide a detailed assessment.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "strengths": ["<strength1>", "<strength2>", ...],
  "gaps": ["<gap1>", "<gap2>", ...],
  "suggestions": ["<suggestion1>", "<suggestion2>", ...],
  "keywordsFound": ["<keyword1>", ...],
  "keywordsMissing": ["<keyword1>", ...],
  "atsScore": <number 0-100>,
  "overallFeedback": "<detailed paragraph>"
}`;

  return await callAI(prompt);
};

// ─── 2. AI Shortlisting (lighter analysis for batch) ────────────────────────

export const aiShortlist = async (resumeText, jobDescription) => {
  const prompt = `You are an expert recruiter AI. Quickly assess candidate-job fit.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return this exact JSON:
{
  "matchScore": <number 0-100>,
  "keyStrengths": ["<strength1>", "<strength2>", "<strength3>"]
}`;

  try {
    return await callAI(prompt, 1024);
  } catch {
    return { matchScore: 0, keyStrengths: [] };
  }
};

// ─── 3. Generate Interview Questions ────────────────────────────────────────

export const generateQuestions = async (role, difficulty, roundType) => {
  const prompt = `You are an expert technical interviewer at a top tech company.
Generate 10 ${difficulty} level ${roundType} interview questions for a ${role} position.

Return this exact JSON structure:
{
  "questions": [
    {
      "id": 1,
      "question": "<question text>",
      "hint": "<brief hint to guide the candidate>",
      "expectedTopics": ["<topic1>", "<topic2>"]
    }
  ]
}

Generate exactly 10 questions with ids 1 through 10.`;

  return await callAI(prompt);
};

// ─── 4. Evaluate Interview Answer ───────────────────────────────────────────

export const evaluateAnswer = async (question, userAnswer, role) => {
  const prompt = `You are a senior technical interviewer evaluating a candidate's answer.
Be fair, constructive, and specific in your feedback.

Evaluate this interview answer for a ${role} position.

QUESTION: ${question}
CANDIDATE'S ANSWER: ${userAnswer}

Return this exact JSON structure:
{
  "score": <number 0-10>,
  "feedback": "<detailed constructive feedback>",
  "whatWasMissed": ["<missed point 1>", "<missed point 2>"],
  "improvedAnswer": "<a model answer that covers all key points>"
}`;

  return await callAI(prompt);
};

// ─── 5. Generate Learning Path ──────────────────────────────────────────────

export const generateLearningPath = async (skillGaps, targetRole, currentLevel) => {
  const prompt = `You are a senior tech mentor and career advisor.
Create an 8-week personalised learning roadmap.

Target Role: ${targetRole}
Current Level: ${currentLevel}
Skill Gaps: ${JSON.stringify(skillGaps)}

Return this exact JSON structure:
{
  "roadmap": [
    {
      "week": 1,
      "focus": "<main focus area>",
      "topics": ["<topic1>", "<topic2>"],
      "resources": [
        {
          "title": "<resource name>",
          "type": "video",
          "url": "<real URL>",
          "platform": "<platform name>"
        }
      ],
      "milestone": "<what the learner should achieve by end of this week>"
    }
  ]
}

Generate all 8 weeks. Include 2-3 resources per week. The "type" field must be one of: "video", "article", "course", "documentation", "practice".
Use real, well-known learning platforms (freeCodeCamp, MDN, Coursera, YouTube, LeetCode, etc).`;

  return await callAI(prompt, 8192);
};
