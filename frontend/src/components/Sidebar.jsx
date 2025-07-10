// Sidebar.jsx
export default function Sidebar() {
  return (
    <div className="w-[260px] bg-gray-900 text-white p-4 flex flex-col">
      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded mb-4 font-medium">
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 bg-gray-800"
          >
            Conversation {i}
          </button>
        ))}
      </div>
    </div>
  );
}
