import { useState } from "react";
import SidebarCode from "../components/SidebarCode";
import { extractCodeBlocksWithLang, removeCodeBlocks, extractSummaryBeforeCodeBlocks } from "../utils/extractCodeBlocks";

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

    // ✨ FIX 1: CRUCIAL - Reset all relevant state for the new request.
    // This prevents the button from showing based on the *previous* request's data.
    setFinalCodeBlocks([]);
    setFullResponse("");
    setSubmittedPrompt(prompt);
    setIsLoading(true);
    setIsSidebarOpen(true);

    try {
      const response = await fetch("http://localhost:3000/questions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      // Set the state based on the new response
      setFullResponse(data.reply);
      const extracted = extractCodeBlocksWithLang(data.reply);
      setFinalCodeBlocks(extracted);

      // --- We no longer need to manually set a 'ready' flag here ---

    } catch (err) {
      console.error("Failed to get response:", err);
      setFullResponse("❌ Failed to get a response.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✨ FIX 2: DERIVED STATE - This is the key.
  // This constant is recalculated on every render. It's always in sync.
  // The button should only show if:
  // 1. We are NOT loading.
  // 2. A prompt has been submitted (so it doesn't show on initial page load).
  // 3. The final code blocks contain both 'html' AND 'css'.
  const isDownloadReady =
    !isLoading &&
    submittedPrompt &&
    finalCodeBlocks.some((block) => block.language === "html") &&
    finalCodeBlocks.some((block) => block.language === "css");


  const handleDownload = async () => {
    // ... your handleDownload function remains the same, it's correct.
    try {
        const htmlBlock = finalCodeBlocks.find((block) => block.language === "html")?.code || "";
        const cssBlock = finalCodeBlocks.find((block) => block.language === "css")?.code || "";
        const jsBlock = finalCodeBlocks.find((block) => block.language === "js")?.code || "";

        if (!htmlBlock || !cssBlock) {
        alert("HTML and CSS are required to download.");
        return;
        }

        const response = await fetch("http://localhost:3000/download/generate-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            html: htmlBlock,
            css: cssBlock,
            js: jsBlock,
        }),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "webpage.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download code.");
    }
  };

  const textOnly = extractSummaryBeforeCodeBlocks(fullResponse, `You asked: "${submittedPrompt}"`);

console.log("FULL RESPONSE:", fullResponse);
console.log("TEXT ONLY:", textOnly);
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
            setSubmittedPrompt(""); // Also clear the submitted prompt
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
          {/* ... your response and landing screen JSX ... */}
           {/* AI Response */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {fullResponse && (
  <div className="bg-[#1a1a1c] rounded-lg p-5 shadow-md border border-gray-700">
    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
      {textOnly || "⚠️ No summary available. Only code was generated."}
    </p>
  </div>
)}
            {!fullResponse && !isLoading && (
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

        {/* ✨ FIX 3: Use the derived constant for clean, reliable rendering */}
        {isDownloadReady && (
         <div
  title={!isDownloadReady ? "Generate code first to enable download." : ""}
>
  <button
    onClick={handleDownload}
    disabled={!isDownloadReady || isLoading}
    className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-md text-sm font-medium shadow-lg transition-all
      ${
        !isDownloadReady || isLoading
          ? "bg-gray-600 cursor-not-allowed opacity-50"
          : "bg-green-600 hover:bg-green-500"
      }`}
  >
    ⬇️ Download ZIP
  </button>
</div>
        )}

      </main>
    </div>
  );
}