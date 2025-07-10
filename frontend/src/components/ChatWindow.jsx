import { useState } from "react";
import { extractCodeBlocksWithLang, removeCodeBlocks } from "../utils/extractCodeBlocks";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ onReplyGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerationActive, setIsGenerationActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || isLoading || isGenerationActive) return;

    setIsLoading(true);
    setIsGenerationActive(true);
    setFullResponse("");
    onReplyGenerated(""); // Reset parent sidebar state

    try {
      const response = await fetch("http://localhost:3000/questions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setFullResponse(data.reply);
      onReplyGenerated(data.reply); // ✅ Send to parent

    } catch (error) {
      setFullResponse("❌ Something went wrong.");
      onReplyGenerated(""); // Clear sidebar
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsGenerationActive(false);
    setFullResponse("");
    onReplyGenerated(""); // Reset sidebar
    setPrompt("");
  };

  const conversationalText = removeCodeBlocks(fullResponse);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100">
        {conversationalText && (
          <MessageBubble sender="assistant" text={conversationalText} />
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-4">
        <textarea
          value={prompt}
          onChange={(e) => {
            if (!isGenerationActive && !isLoading) setPrompt(e.target.value);
          }}
          className="flex-1 border rounded p-3 resize-none"
          rows="2"
          placeholder="Type your question..."
          disabled={isLoading || isGenerationActive}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt || isGenerationActive}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Send"}
        </button>
        {isGenerationActive && (
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset
          </button>
        )}
      </form>
    </div>
  );
}
