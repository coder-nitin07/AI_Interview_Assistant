import { useState } from "react";
import SidebarCode from "../components/SidebarCode";
import { extractCodeBlocksWithLang, removeCodeBlocks } from "../utils/extractCodeBlocks";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [isTypingCode, setIsTypingCode] = useState(false); // NEW
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [finalCodeBlocks, setFinalCodeBlocks] = useState([]);
  const [fullResponse, setFullResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setSubmittedPrompt(prompt);
    setIsLoading(true);
    setIsSidebarOpen(true);
    setFullResponse("");

    try {
      const response = await fetch("http://localhost:3000/questions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      setFullResponse(data.reply);
      setFinalCodeBlocks(extractCodeBlocksWithLang(data.reply));
    } catch (err) {
      setFullResponse("❌ Failed to get a response.");
    } finally {
      setIsLoading(false);
    }
  };

  const textOnly = removeCodeBlocks(fullResponse);

  return (
    <div className="h-screen w-full bg-[#0e0e10] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#111113]">
        <h1 className="text-lg font-semibold tracking-wide">🧠 AI Code Assistant</h1>
        <button
          onClick={() => {
            setPrompt("");
            setFullResponse("");
            setIsSidebarOpen(false);
            setFinalCodeBlocks([]);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          + New Chat
        </button>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Prompt + AI Text */}
        <div className={`${isSidebarOpen ? "w-[60%]" : "w-full"} h-full flex flex-col justify-between border-r border-gray-800`}>
          <div className="flex-1 overflow-y-auto p-6">
            {textOnly && (
              <div className="bg-[#1a1a1c] rounded-md p-4 mb-6 shadow-md">
                <p className="text-gray-300 whitespace-pre-wrap">{textOnly}</p>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-[#111113] flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 bg-[#1c1c1f] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
              disabled={isLoading || isTypingCode}
            />
            <button
              type="submit"
              disabled={!prompt || isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white disabled:bg-gray-500"
            >
              {isLoading ? "Thinking..." : "Generate"}
            </button>
          </form>
        </div>

        {/* RIGHT: SidebarCode (only when open) */}
        {isSidebarOpen && (
  <div className="w-[40%] h-full overflow-y-auto">
    <SidebarCode
      codeBlocks={finalCodeBlocks}
      onClose={() => setIsSidebarOpen(false)}
      isLoading={isLoading}
      setIsTypingCode={setIsTypingCode}
    />
  </div>
)}
      </div>
    </div>
  );
}
