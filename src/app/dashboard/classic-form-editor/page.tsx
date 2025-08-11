"use client";
import { useState } from "react";
import ClassicFormEditor from "./classicForm";

function StoryFormEditor() {
  const [storyBlocks, setStoryBlocks] = useState<string[]>(["Once upon a time..."]);
  const [newBlock, setNewBlock] = useState("");

  const addBlock = () => {
    if (newBlock.trim()) {
      setStoryBlocks((prev) => [...prev, newBlock.trim()]);
      setNewBlock("");
    }
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold">📖 Story Mode</h3>
      <div className="space-y-3">
        {storyBlocks.map((block, idx) => (
          <div
            key={idx}
            className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg leading-relaxed text-gray-800"
          >
            {block}
          </div>
        ))}
      </div>
      <textarea
        value={newBlock}
        onChange={(e) => setNewBlock(e.target.value)}
        placeholder="Write the next part of the story..."
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
      />
      <button
        onClick={addBlock}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium shadow"
      >
        ➕ Add Story Block
      </button>
    </div>
  );
}

function ChatFormEditor() {
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "👋 Hi! How can I help you create your form today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input.trim() }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "✅ Got it! I've added that to your form." }
      ]);
    }, 500);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md flex flex-col h-[70vh]">
      <h3 className="text-lg font-semibold mb-4">💬 Chat Mode</h3>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                m.from === "bot"
                  ? "bg-gray-100 text-gray-800 rounded-bl-none"
                  : "bg-black text-white rounded-br-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-5 rounded-lg hover:bg-gray-800 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function FormEditor() {
  type Mode = "chat" | "story" | "classic";
  const [mode, setMode] = useState<Mode>("chat");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Untitled form</h2>
        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm">
          Save & Continue
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 pb-2">
        {(["classic", "story", "chat"] as Mode[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMode(tab)}
            className={`text-sm font-medium pb-1 ${
              tab === mode
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Mode
          </button>
        ))}
      </div>

      {/* Mode Content */}
      {mode === "classic" && <ClassicFormEditor />}
      {mode === "story" && <StoryFormEditor />}
      {mode === "chat" && <ChatFormEditor />}
    </div>
  );
}
