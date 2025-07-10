import { useEffect, useRef } from "react";

export default function CodePreview({ blocks }) {
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
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-2">🔍 Code Preview</h2>
      <iframe
        ref={iframeRef}
        title="Preview"
        className="w-full h-64 border rounded"
      />
    </div>
  );
}
