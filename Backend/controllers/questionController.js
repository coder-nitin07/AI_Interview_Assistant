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
You are an expert front-end developer.

When the user asks to create a UI component using HTML, CSS, and JavaScript:

1. First, provide a brief explanation of what you're creating (2-3 sentences max).

2. Then output ONLY the three clean code blocks in this exact format:
   - One HTML block (\`\`\`html)
   - One CSS block (\`\`\`css)  
   - One JS block (\`\`\`js)

✅ IMPORTANT RULES:
- Do NOT include any explanatory text between or after code blocks
- Do NOT repeat "HTML:", "CSS:", "Structure:" etc. 
- Do NOT mix explanations with code blocks
- Each code block should appear only once
- Keep explanations BEFORE the code blocks only

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