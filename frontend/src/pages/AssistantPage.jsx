import { useState } from "react";
import axios from "axios";
import CodeBlock from "../components/CodeBlock";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/questions/ask", {
        message: prompt,
      });
      setReply(res.data.reply);
    } catch (err) {
      setReply("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🧠 AI Interview Assistant</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask a question like: 'Give me React useEffect questions'"
        className="w-full p-3 border rounded mb-3"
        rows={4}
      />

      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {reply && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">AI Response:</h2>
          <CodeBlock text={reply} />
        </div>
      )}
    </div>
  );
}