// Home.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Prompt from "./Prompt";
import { Menu } from "lucide-react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState([]);

  const handleNewChat = () => {
    setPrompt([]);  // Clear all messages to start new chat
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#232327] transition-transform z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex-shrink-0`}
      >
        <Sidebar
          onNewChat={handleNewChat}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col w-full items-center justify-center">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700 w-full">
          <div className="text-xl font-bold">deepseek</div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <div className="w-full flex-1 flex items-center justify-center px-2 sm:px-6">
          <Prompt prompt={prompt} setPrompt={setPrompt} />
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
