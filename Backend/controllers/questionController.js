const { callGeminiAPI } = require("../utils/geminiClient");
const {formatGeminiResponse} = require("../utils/geminiFormat");

// Create Question Route
const generateQuestion = async (req, res)=>{
    try {
        console.log("Hello nw")
        const { role, experience, topics } = req.body;

        if(!role || !experience){
            return res.status(400).json({ message: 'Role and Experience are required' });
        }

        const prompt = `
            You are a senior technical interviewer.

            Generate 5 practical interview questions for a ${role} with ${experience} of experience.
            ${topics && topics.length > 0 ? `Focus on these topics: ${topics.join(', ')}` : ''}
            For each question, add a brief explanation of why it’s important.
        `;

        const questions = await callGeminiAPI(prompt);
        console.log("Raw Gemini Response:\n", questions)

        const formattedResponse = formatGeminiResponse(questions);

        res.status(200).json({ questions: formattedResponse });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to Generate Questions' });
    }
};

module.exports = { generateQuestion };