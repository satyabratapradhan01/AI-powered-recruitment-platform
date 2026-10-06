import dotenv from 'dotenv';
dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;

async function testWorkingModels() {
  const models = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant. Always respond with a valid JSON object.' },
            { role: 'user', content: 'Analyze this sample resume against a job and return JSON with {"score": 85, "summary": "Great match"}' }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        }),
      });

      const resText = await response.text();
      console.log(`Model: ${model} | HTTP Status: ${response.status} | Output: ${resText.substring(0, 300)}`);
    } catch (err) {
      console.log(`Model: ${model} | Error: ${err.message}`);
    }
  }
}

testWorkingModels();
