export const extractCodeBlocksWithLang = (text) => {
  const regex = /```(\w+)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const language = match[1].toLowerCase(); // like "html", "css", "js"
    const code = match[2].trim();

    // ✅ Filter out explanations inside code accidentally
    if (code.length < 10) continue;
    
    blocks.push({ language, code });
  }

  return blocks;
};

export const removeCodeBlocks = (markdownText) => {
  return markdownText
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove structural explanations that appear with code
    .replace(/\*\*\*?HTML:\*\*\*?.*$/gm, "")
    .replace(/\*\*\*?CSS:\*\*\*?.*$/gm, "")
    .replace(/\*\*\*?JavaScript:\*\*\*?.*$/gm, "")
    .replace(/\*\*\*?JS:\*\*\*?.*$/gm, "")
    // Remove numbered structure explanations
    .replace(/\d+\.\s*\*\*Structure:\*\*.*$/gm, "")
    // Remove any remaining structural markers
    .replace(/\*\*Structure:\*\*.*$/gm, "")
    // Clean up extra whitespace and newlines
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
};