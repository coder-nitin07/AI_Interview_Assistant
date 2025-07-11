import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function PreviewPage() {
  const { id } = useParams();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`http://localhost:3000/preview/${id}`);
        if (!res.ok) throw new Error("Preview not found");
        const data = await res.json();

        const { html, css, js } = data;

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

        setLoading(false);
      } catch (err) {
        console.error("Preview load error:", err);
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchPreview();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading preview...</div>;
  if (notFound) return <div className="p-6 text-red-400">❌ Preview not found or expired.</div>;

  return (
  <div className="h-screen w-full flex items-center">
    <div className="w-full h-full shadow-2xl border border-gray-700 rounded overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Shared Preview"
        className="w-full h-full bg-white"
      />
    </div>
  </div>
);

}
