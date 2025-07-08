export default function CodeBlock({ text }) {
  return (
    <pre className="bg-gray-900 text-white p-4 rounded whitespace-pre-wrap overflow-auto">
      {text}
    </pre>
  );
}
