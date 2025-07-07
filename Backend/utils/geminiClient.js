const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;
console.log("API Key", API_KEY);

const callGeminiAPI = async (promptText) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = response.data.candidates[0]?.content?.parts[0]?.text;

    return aiText || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = { callGeminiAPI };