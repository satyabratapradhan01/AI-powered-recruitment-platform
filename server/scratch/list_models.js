import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const listModels = async () => {
  try {
    let allModels = [];
    let pageToken = '';
    do {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}${pageToken ? '&pageToken=' + pageToken : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.models) {
        allModels = allModels.concat(data.models);
      }
      pageToken = data.nextPageToken || '';
    } while (pageToken);

    const generateModels = allModels
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));

    console.log('Generate Content Models:', generateModels);
  } catch (err) {
    console.error('Error listing models:', err);
  }
};

listModels();
