const formatGeminiResponse = (rawText) => {
  const formatted = [];

  const parts = rawText.split(/\*\*\d+\.\s*Question:\*\*/gi);

  parts.forEach((part) => {
    const [questionLine, ...rest] = part.trim().split('\n');
    const question = questionLine?.replace(/["“”]/g, '').trim();
    const explanation = rest.join(' ').trim();

    if (question && explanation) {
      formatted.push({ question, explanation });
    }
  });

  return formatted;
};


module.exports = { formatGeminiResponse };