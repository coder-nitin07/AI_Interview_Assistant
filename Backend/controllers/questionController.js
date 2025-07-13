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
You are an expert front-end developer. Your task is to generate a fully responsive single-page website using only HTML, CSS, and minimal JavaScript (ONLY if absolutely required).

⚠️ Important Instructions:
- Do NOT use any images or external links.
- Use only clean, modern, accessible HTML, CSS, and JavaScript.
- Use vibrant background colors, gradients, icons (emoji or inline SVGs), spacing, and layout to create visual beauty.
- Make the layout responsive (desktop + mobile).
- Each navigation link in the header must scroll smoothly to its section (via anchor tags).
- All sections must use proper IDs (e.g., #about, #services).
- The header should be **sticky**.
- For mobile: the header should collapse into a hamburger menu, which toggles open/close **on click** (use basic JavaScript for this).
- Do NOT include broken images or placeholder images.

📄 Section Requirements:
1. Sticky Header with nav links (Home, About, Services, Contact)
2. Hero Section with title + button
3. About Section (1-2 paragraphs)
4. Services Section with 3-4 colorful feature cards
5. Contact/Footer Section
6. Smooth scroll behavior via CSS

✅ Output:
- First block: HTML (with correct IDs, header links, and mobile toggle)
- Second block: CSS (fully styled and responsive)
- Third block: JavaScript (only if required for mobile menu)

---
Now generate a responsive landing page for this topic:
"${message}"
`;



        const reply = await callGeminiAPI(prompt);

        res.status(200).json({ reply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to Process AI request' });
    }    
};

module.exports = { askAI };