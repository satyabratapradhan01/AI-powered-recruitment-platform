import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const testModels = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
];

const run = async () => {
  for (const model of testModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with JSON {"status": "ok"}' }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      console.log(`Model ${model} Status:`, res.status);
      const text = await res.text();
      if (res.ok) {
        console.log(`SUCCESS on ${model}! Response:`, text);
        break;
      } else {
        console.log(`FAIL on ${model}:`, text.substring(0, 150));
      }
    } catch (e) {
      console.error(`ERROR on ${model}:`, e.message);
    }
  }
};

run();
