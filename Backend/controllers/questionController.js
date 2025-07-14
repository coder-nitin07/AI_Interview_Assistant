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

Your job is to generate a fully responsive single-page website based on the user's request using only **vanilla HTML, CSS, and JS**.

⚠️ IMPORTANT INSTRUCTIONS:
- Start with a short summary (4-5 sentences) describing what the webpage does.
- Make the design fully responsive using CSS media queries or flexible layouts (e.g., Flexbox, Grid).
- The layout should work on desktop and mobile.
- Focus on the Header and Header should be attractive and on the mobile screen the nav-link will be hidden and the hambuger menu show and when the User click on the icon the nav-links close and open, handle this with the help of JS and CSS.
- After the Header Create an Hero Section with the Some text with no Image and but in Background fill with the Background color and with the One Heading and 2 lines about the website.
_ After the Hero Section, Create a section for Cards and fill the cards with the data and the data about related to the website. Create only three cards.
- Then create footer.
- The Website should be full responsive and Choose good colors for the Website.
- Then output code blocks using triple backticks (\`\`\`html, \`\`\`css, \`\`\`js).
- HTML must be in one code block labeled \`\`\`html
- CSS must be in one code block labeled \`\`\`css
- JS must be in one code block labeled \`\`\`js
- Do NOT include explanations after the code blocks.

✅ Sample Output Format:

This is a responsive landing page for a digital agency with a mobile-friendly navigation menu.

\`\`\`html
<!-- html code here -->
\`\`\`

\`\`\`css
/* css here */
\`\`\`

\`\`\`js
// only if needed
\`\`\`

---

User Request: ${message}
`;
  


        const reply = await callGeminiAPI(prompt);

        res.status(200).json({ reply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to Process AI request' });
    }    
};

module.exports = { askAI };