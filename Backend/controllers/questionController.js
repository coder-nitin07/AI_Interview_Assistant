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
You are a world-class UI/UX designer and expert front-end developer. Your primary goal is to create a visually stunning, modern, and engaging single-page website that is fully responsive.

🎨 Design Philosophy (Follow this carefully):
-   **Modern & Clean:** The design must feel current and professional. Use ample white space, clean lines, and a cohesive layout.
-   **Visually Engaging:** Do not just create simple text sections. Use layouts, cards, icons, and typography to make each section interesting.
-   **Color & Gradient:** Use a beautiful, cohesive color palette defined in CSS variables. Use linear gradients for backgrounds or key elements to add depth and visual appeal.
-   **Interactivity:** Add subtle hover effects (e.g., slight lift, color change, shadow) to buttons, links, and cards to make the page feel alive.
-   **Typography:** Use a clean, readable font (from Google Fonts or a standard web-safe font). Establish a clear visual hierarchy with different font sizes and weights.

📄 Detailed Section Requirements:
1.  **Header:** A sticky header containing a creative logo (emoji + text) and navigation.
2.  **Hero Section:** A captivating, full-height or large hero section. It must have:
    -   A large, bold headline.
    -   A compelling subheading that explains value or creates interest.
    -   A prominent call-to-action (CTA) button with an eye-catching style (e.g., gradient background, slight shadow).
3.  **Features/Services Section:**
    -   Display 3-4 features in a responsive grid or flexbox layout.
    -   Each feature must be a "card" with a border, box-shadow, and padding.
    -   Each card must contain an icon (emoji or inline SVG), a feature title, and a short descriptive paragraph.
4.  **"About Us" or "Showcase" Section:**
    -   Create an engaging section with a two-column layout on desktop (stacking on mobile).
    -   One column for a heading and descriptive text.
    -   The other column can feature a stylized element, like a large quote block or a list of key points with checkmark icons (✅).
5.  **Footer:**
    -   A clean and organized multi-section footer.
    -   Include columns for "Quick Links," "Contact Info," and mock "Social Media" links (using emojis as icons: 🐦, 💼, 깃허브).
    -   End with a centered copyright notice.

⚙️ Core Functionality Requirements (Strict):
-   **Sticky Header:** Must use \`position: sticky; top: 0;\` and \`display: flex; justify-content: space-between; align-items: center;\`.
-   **Smooth Scrolling:** The rule \`html { scroll-behavior: smooth; }\` is mandatory. Anchor links must work perfectly.
-   **Mobile Menu:** Implement a hamburger menu that toggles an \`.active\` class on the navigation element using minimal JavaScript. The CSS must handle the show/hide logic based on this class.

✅ Output Format:
Your response must be structured into three distinct markdown code blocks. Do not add any text or explanation outside of these blocks.

-   First block: \`\`\`html\`\`\` (with semantic tags and all required IDs and classes)
-   Second block: \`\`\`css\`\`\` (with CSS variables, all styles, responsive media queries, and hover effects)
-   Third block: \`\`\`javascript\`\`\` (with only the minimal hamburger toggle code)

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