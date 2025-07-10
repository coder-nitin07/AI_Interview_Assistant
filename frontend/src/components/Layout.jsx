// Layout.jsx
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
