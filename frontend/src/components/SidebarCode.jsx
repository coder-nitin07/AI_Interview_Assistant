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

    // If the new code is shorter than what's displayed, just snap to the new code
    if (code.length < displayedCode.length) {
        setDisplayedCode(code);
        setIsComplete(true);
        if (onComplete) onComplete();
        return;
    }

    // Start typing from where we left off
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
    }, 10); // Typing speed

    return () => clearInterval(interval);
  }, [code, animate, onComplete]);

  return (
    <div className="mb-6 animate-fade-in">
      <div className="text-xs text-gray-400 mb-1 uppercase flex justify-between items-center">
        {language}
        <div className="flex items-center gap-2">
          {isComplete && (
            <span className="text-green-400 text-xs">✓ Complete</span>
          )}
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

// Preview component that will be shown in sidebar
function CodePreview({ blocks }) {
  const iframeRef = useRef();

  useEffect(() => {
    const html = blocks.find((b) => b.language === "html")?.code || "";
    const css = blocks.find((b) => b.language === "css")?.code || "";
    const js = blocks.find((b) => b.language === "js")?.code || "";

    const combined = `
      <html>
        <head>
          <style>${css}</style>
        </head>
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
  const [visibleBlocks, setVisibleBlocks] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  
  // ✅ Define the order of code blocks
  const blockOrder = ['html', 'css', 'js'];
  
  // ✅ Sort code blocks according to the desired order
  const sortedCodeBlocks = blockOrder.map(lang => 
    codeBlocks.find(block => block.language === lang)
  ).filter(Boolean);

  // ✅ Reset when new code blocks arrive
  useEffect(() => {
    if (codeBlocks.length > 0 && !isLoading) {
      setVisibleBlocks([]);
      setCurrentBlockIndex(0);
      setShowPreview(false);
      
      // Start showing the first block
      setTimeout(() => {
        if (sortedCodeBlocks.length > 0) {
          setVisibleBlocks([sortedCodeBlocks[0]]);
          setIsTypingCode(true);
        }
      }, 500); // Small delay before starting
    }
  }, [codeBlocks, isLoading]);

  

  // ✅ Handle completion of current block and show next one
  const handleBlockComplete = () => {
  const nextIndex = currentBlockIndex + 1;

  if (nextIndex < sortedCodeBlocks.length) {
    // Add the next block after a short delay
    setTimeout(() => {
      setVisibleBlocks(prev => [...prev, sortedCodeBlocks[nextIndex]]);
      setCurrentBlockIndex(nextIndex);
    }, 300);
  } else {
    // ✅ All blocks are done – stop typing
    setIsTypingCode(false);
  }
  };


  // ✅ Only show preview button when all blocks are complete
  const allBlocksComplete = visibleBlocks.length === sortedCodeBlocks.length && sortedCodeBlocks.length > 0;
  const canShowPreview = !isLoading && allBlocksComplete;

  return (
    <div className="w-full h-full bg-gray-900 text-white overflow-y-auto p-4 border-l border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Generated Code</h2>
        <button onClick={onClose} className="text-sm text-red-400 hover:text-red-300">
          ✕ Close
        </button>
      </div>

      {/* ✅ Progress indicator */}
      {sortedCodeBlocks.length > 0 && (
        <div className="mb-4 text-xs text-gray-400">
          Progress: {visibleBlocks.length} / {sortedCodeBlocks.length} blocks
        </div>
      )}

      {/* ✅ Show Preview Button - only when all blocks are complete */}
      {canShowPreview && (
        <div className="mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      )}

      {/* ✅ Sequential code blocks */}
      {visibleBlocks.map((block, index) => (
        <TypingCode
          key={block.language + index}
          language={block.language}
          code={block.code}
          animate={true}
          onComplete={index === visibleBlocks.length - 1 ? handleBlockComplete : undefined}
        />
      ))}

      {/* ✅ Show preview in sidebar when button is clicked */}
      {showPreview && canShowPreview && (
        <CodePreview blocks={sortedCodeBlocks} />
      )}

      {/* ✅ Loading indicator */}
      {isLoading && (
        <div className="text-center text-gray-400 mt-4">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Generating code...
        </div>
      )}

      {/* ✅ Waiting for next block indicator */}
      {!isLoading && visibleBlocks.length < sortedCodeBlocks.length && visibleBlocks.length > 0 && (
        <div className="text-center text-gray-400 mt-4">
          <div className="animate-pulse">
            Preparing {blockOrder[visibleBlocks.length]}...
          </div>
        </div>
      )}
    </div>
  );
}