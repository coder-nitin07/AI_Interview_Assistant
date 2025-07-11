import { useEffect, useState, useRef } from "react";

// The TypingCode component with completion callback
function TypingCode({ language, code, animate, onComplete }) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!animate) {
      setDisplayedCode(code);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    if (code.length < displayedCode.length) {
      setDisplayedCode(code);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    let i = displayedCode.length;
    const interval = setInterval(() => {
      if (i >= code.length) {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) onComplete();
        return;
      }
      setDisplayedCode(code.slice(0, i + 1));
      i++;
    }, 10);

    return () => clearInterval(interval);
  }, [code, animate, onComplete]);

  return (
    <div className="mb-6 animate-fade-in">
      <div className="text-xs text-gray-400 mb-1 uppercase flex justify-between items-center">
        {language}
        <div className="flex items-center gap-2">
          {isComplete && <span className="text-green-400 text-xs">✓ Complete</span>}
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-gray-400 hover:text-white"
          >
            Copy
          </button>
        </div>
      </div>
      <pre className="bg-gray-800 p-3 rounded overflow-x-auto whitespace-pre-wrap text-sm">
        {displayedCode}
      </pre>
    </div>
  );
}

// Live preview iframe
function CodePreview({ blocks }) {
  const iframeRef = useRef();

  useEffect(() => {
    const html = blocks.find((b) => b.language === "html")?.code || "";
    const css = blocks.find((b) => b.language === "css")?.code || "";
    const js = blocks.find((b) => b.language === "js")?.code || "";

    const combined = `
      <html>
        <head><style>${css}</style></head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = combined;
    }
  }, [blocks]);

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">🔍 Live Preview</h3>
      <iframe
        ref={iframeRef}
        title="Preview"
        className="w-full h-64 border border-gray-600 rounded bg-white"
      />
    </div>
  );
}

export default function SidebarCode({ codeBlocks, onClose, isLoading, setIsTypingCode }) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [hasTypedOnce, setHasTypedOnce] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  const blockOrder = ["html", "css", "js"];
  const sortedCodeBlocks = blockOrder
    .map((lang) => codeBlocks.find((block) => block.language === lang))
    .filter(Boolean);

  useEffect(() => {
    if (codeBlocks.length > 0 && !isLoading) {
      setVisibleBlocks([]);
      setCurrentBlockIndex(0);
      setShowPreview(false);
      setHasTypedOnce(false);

      setTimeout(() => {
        if (sortedCodeBlocks.length > 0) {
          setVisibleBlocks([sortedCodeBlocks[0]]);
          setIsTypingCode(true);
        }
      }, 500);
    }
  }, [codeBlocks, isLoading]);

  const handleBlockComplete = () => {
    const nextIndex = currentBlockIndex + 1;
    if (nextIndex < sortedCodeBlocks.length) {
      setTimeout(() => {
        setVisibleBlocks((prev) => [...prev, sortedCodeBlocks[nextIndex]]);
        setCurrentBlockIndex(nextIndex);
      }, 300);
    } else {
      setIsTypingCode(false);
      setHasTypedOnce(true);
    }
  };

  const allBlocksComplete =
    visibleBlocks.length === sortedCodeBlocks.length && sortedCodeBlocks.length > 0;
  const canShowPreview = !isLoading && allBlocksComplete;

  // ✅ Moved here to access sortedCodeBlocks
  const handleShare = async () => {
    const html = sortedCodeBlocks.find((b) => b.language === "html")?.code || "";
    const css = sortedCodeBlocks.find((b) => b.language === "css")?.code || "";
    const js = sortedCodeBlocks.find((b) => b.language === "js")?.code || "";

    try {
      const res = await fetch("http://localhost:3000/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, css, js }),
      });

      const data = await res.json();
     if (data.previewUrl) {
  const parts = data.previewUrl.split('/');
  const previewId = parts[parts.length - 1]; // ✅ Extract UUID from the URL

  const uiPreviewUrl = `http://localhost:5173/preview-ui/${previewId}`; // ✅ Use previewId

  await navigator.clipboard.writeText(uiPreviewUrl);
  alert("✅ Preview link copied to clipboard:\n" + uiPreviewUrl);
}
}catch (err) {
      console.error("Error sharing preview:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white overflow-y-auto p-4 border-l border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Generated Code</h2>
        <button onClick={onClose} className="text-sm text-red-400 hover:text-red-300">
          ✕ Close
        </button>
      </div>

      {sortedCodeBlocks.length > 0 && (
        <div className="mb-4 text-xs text-gray-400">
          Progress: {visibleBlocks.length} / {sortedCodeBlocks.length} blocks
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "code" ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "preview" ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("preview")}
          disabled={!canShowPreview}
        >
          Preview
        </button>
        {canShowPreview && (
          <button
            onClick={handleShare}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            🔗 Share Preview
          </button>
        )}
      </div>

      {activeTab === "code" &&
        visibleBlocks.map((block, index) => (
          <TypingCode
            key={block.language}
            language={block.language}
            code={block.code}
            animate={!hasTypedOnce}
            onComplete={index === visibleBlocks.length - 1 ? handleBlockComplete : undefined}
          />
        ))}

      {activeTab === "preview" && canShowPreview && <CodePreview blocks={sortedCodeBlocks} />}

      {isLoading && (
        <div className="text-center text-gray-400 mt-4">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Generating code...
        </div>
      )}

      {!isLoading &&
        visibleBlocks.length < sortedCodeBlocks.length &&
        visibleBlocks.length > 0 && (
          <div className="text-center text-gray-400 mt-4">
            <div className="animate-pulse">
              Preparing {blockOrder[visibleBlocks.length]}...
            </div>
          </div>
        )}
    </div>
  );
}
