import { useState } from "react";
import SidebarCode from "../components/SidebarCode";
import { extractCodeBlocksWithLang, removeCodeBlocks } from "../utils/extractCodeBlocks";

// --- NOTE: All JavaScript logic from your original file remains UNCHANGED. ---
// --- Only the JSX and CSS classes have been updated for a better UI. ---

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
    // I am intentionally not clearing the prompt here to show the user what they asked
    // If you want to clear it, add: setPrompt("");

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
    // Main container with a sophisticated dark theme
    <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header with Glassmorphism effect */}
      <header className="px-6 py-4 bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between shadow-lg z-10 flex-shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-white">
          AI Code Assistant
        </h1>
        <button
          onClick={() => {
            // This is your original, unchanged logic
            setPrompt("");
            setSubmittedPrompt(""); // Added to fully reset
            setFullResponse("");
            setIsSidebarOpen(false);
            setFinalCodeBlocks([]);
          }}
          className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 ring-1 ring-blue-500/50 hover:ring-blue-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Chat
        </button>
      </header>

      {/* Main Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* LEFT: Prompt & Response. The transition logic is unchanged. */}
        <section
          className={`transition-all duration-500 ease-in-out ${
            isSidebarOpen ? "w-[60%]" : "w-full"
          } h-full flex flex-col bg-slate-800/30`}
        >
          {/* Main content area with better padding and scrolling */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {textOnly ? (
              // Response bubble with improved styling and typography
              <div className="bg-slate-800/50 rounded-xl p-5 shadow-lg border border-slate-700/50">
                <article className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-200 prose-p:text-slate-200">
                    <p>{textOnly}</p>
                </article>
              </div>
            ) : (
              // A more engaging welcome screen
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 -mt-16">
                <svg className="w-16 h-16 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <h2 className="text-2xl font-semibold text-slate-200 mb-2">AI Code Assistant</h2>
                <p className="max-w-md">
                  Generate complete webpages using HTML, CSS, and JavaScript instantly.
                </p>
              </div>
            )}
          </div>

          {/* Prompt Input Form with enhanced styling */}
          <div className="p-4 sm:p-5 bg-slate-900/50 border-t border-slate-700/50">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask something like 'Make a responsive navbar in HTML & CSS...'"
                className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg text-sm transition-all duration-300"
                disabled={isLoading || isTypingCode}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center w-32 shadow-lg ${
                  !prompt.trim() || isLoading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                ) : (
                  "Generate"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* RIGHT: Code Sidebar. Logic remains identical. */}
        {isSidebarOpen && (
          <aside className="w-[40%] h-full overflow-y-auto bg-slate-900/70 backdrop-blur-lg border-l border-slate-700/50">
            {/* The SidebarCode component is called exactly as it was before. */}
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