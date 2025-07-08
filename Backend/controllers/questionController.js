const { callGeminiAPI } = require("../utils/geminiClient");
const {formatGeminiResponse} = require("../utils/geminiFormat");

// Ask question from AI
const askAI = async (req, res)=>{
    try {
        console.log("Request body:", req.body);

        const { message } = req.body;

        if(!message){
            return res.status(400).json({ message: 'message is required' });
        }

        const prompt = `
                You are an AI interview assistant.

                When the user types a message, you should do ONE of the following:

                1. If they ask for interview questions, generate 5 practical questions with explanations.
                2. If they ask you to evaluate an answer, give strengths, weaknesses, and suggestions.
                3. If it's unclear, ask for clarification.

                User Message:
                ${message}
        `;

        const reply = await callGeminiAPI(prompt);

        res.status(200).json({ reply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to Process AI request' });
    }    
};

module.exports = { askAI };