import { useState } from "react";
import SidebarCode from "../components/SidebarCode";
import { extractCodeBlocksWithLang, removeCodeBlocks } from "../utils/extractCodeBlocks";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [isTypingCode, setIsTypingCode] = useState(false);
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
    <div className="h-screen w-full bg-[#0e0e10] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 bg-[#131316] flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-semibold tracking-wide text-white">
          AI WebPage Assistant
        </h1>
        <button
          onClick={() => {
            setPrompt("");
            setFullResponse("");
            setIsSidebarOpen(false);
            setFinalCodeBlocks([]);
          }}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Chat
        </button>
      </header>

      {/* Main Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* LEFT: Prompt & Response */}
        <section
          className={`transition-all duration-300 ${
            isSidebarOpen ? "w-[60%]" : "w-full"
          } h-full flex flex-col border-r border-gray-800`}
        >
          {/* AI Response */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {textOnly ? (
  <div className="bg-[#1a1a1c] rounded-lg p-5 shadow-md border border-gray-700">
    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
      {textOnly}
    </p>
  </div>
) : (
  <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-12">
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-white mb-2">🚀 Build Stunning Webpages with AI</h2>
      <p className="text-lg text-gray-400 max-w-xl mx-auto">
        Generate complete responsive webpages using just a prompt. No images, just smart layouts, vibrant colors, and clean code.
      </p>
    </div>

    <div className="mt-8">
      <p className="text-md font-semibold text-gray-300 mb-2">Try asking things like:</p>
      <ul className="space-y-2 text-sm text-gray-400">
        <li>👉 Create a personal portfolio landing page</li>
        <li>👉 Design a responsive pricing table with 3 plans</li>
        <li>👉 Build a contact form with clean layout</li>
        <li>👉 Create a digital agency one-page website</li>
      </ul>
    </div>
  </div>
)}

          </div>

          {/* Prompt Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#131316] border-t border-gray-800 flex gap-4"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question about HTML, CSS, JS..."
              className="flex-1 bg-[#1e1e22] text-white placeholder-gray-400 px-4 py-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-inner text-sm transition-all"
              disabled={isLoading || isTypingCode}
            />
            <button
              type="submit"
              disabled={!prompt || isLoading}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Thinking..." : "Generate"}
            </button>
          </form>
        </section>

        {/* RIGHT: SidebarCode */}
        {isSidebarOpen && (
          <aside className="w-[40%] h-full overflow-y-auto bg-[#121214] border-l border-gray-800">
            <SidebarCode
              codeBlocks={finalCodeBlocks}
              onClose={() => setIsSidebarOpen(false)}
              isLoading={isLoading}
              setIsTypingCode={setIsTypingCode}
            />
          </aside>
        )}
      </main>
    </div>
  );
}
