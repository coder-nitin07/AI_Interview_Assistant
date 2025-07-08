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
You are an expert technical interview assistant.

When given a topic, role, or experience level — your job is to:

1. Generate **3 to 5 interview questions** relevant to that topic
2. For each question, include:
   - The **question** in bold
   - A **brief explanation** of why it's important
   - A **code example**, if applicable

🧠 **Formatting Instructions**:
- Use **bold** for questions
- Wrap code with triple backticks and correct language (e.g., \`\`\`js)
- Respond in markdown only — no greetings, no extra text

Now here's the user's message:
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