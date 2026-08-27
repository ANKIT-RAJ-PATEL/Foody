import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useAiChat from "../hooks/useAiChat";
import { IoClose, IoSend, IoSparkles, IoTrash } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";
import {
  FaSmile, FaFrown, FaTired, FaHamburger, FaRocket, FaMeh,
  FaStore, FaListUl, FaClipboardList, FaMapMarkerAlt, FaRoute, FaLightbulb,
} from "react-icons/fa";

// mood options for user role
const MOOD_OPTIONS = [
  { key: "happy", label: "Happy", icon: FaSmile, color: "from-yellow-400 to-orange-400" },
  { key: "sad", label: "Sad", icon: FaFrown, color: "from-blue-400 to-blue-600" },
  { key: "tired", label: "Tired", icon: FaTired, color: "from-purple-400 to-purple-600" },
  { key: "hungry", label: "Hungry", icon: FaHamburger, color: "from-red-400 to-red-600" },
  { key: "stressed", label: "Stressed", icon: FaMeh, color: "from-gray-400 to-gray-600" },
  { key: "excited", label: "Excited", icon: FaRocket, color: "from-pink-400 to-pink-600" },
];

// quick action buttons for owner and delivery boy
const QUICK_ACTIONS = {
  owner: [
    { label: "Setup Help", icon: FaStore, message: "Help me set up my restaurant" },
    { label: "Menu Tips", icon: FaListUl, message: "Give me tips for my menu" },
    { label: "Order Help", icon: FaClipboardList, message: "How to manage orders?" },
  ],
  deliveryboy: [
    { label: "Route Help", icon: FaRoute, message: "Help me with route optimization" },
    { label: "Location Issue", icon: FaMapMarkerAlt, message: "I have a location issue" },
    { label: "Delivery Tips", icon: FaLightbulb, message: "Give me delivery tips" },
  ],
};

function AiChatPanel({ isOpen, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const {
    messages, isLoading, selectedProvider,
    setSelectedProvider, sendMessage, clearChat, addMessage,
  } = useAiChat();

  const [inputText, setInputText] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // greeting message when panel opens first time
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      const role = userData?.role;
      let greeting = "";

      if (role === "user") {
        greeting = "Hello! I'm Foody AI. How are you feeling today? Pick your mood below or just type!";
      } else if (role === "owner") {
        greeting = "Welcome, Chef! I'm Foody AI. I can help you with restaurant setup, menu tips, or order management. What do you need?";
      } else if (role === "deliveryboy") {
        greeting = "Hey Rider! I'm Foody AI. Need help with routes, location issues, or delivery tips? I'm here for you!";
      } else {
        greeting = "Hello! I'm Foody AI. How can I help you today?";
      }

      addMessage("assistant", greeting);
    }
  }, [isOpen, hasGreeted, messages.length, userData?.role]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const handleMoodSelect = (mood) => {
    sendMessage(`I'm feeling ${mood.key}`);
  };

  const handleQuickAction = (action) => {
    sendMessage(action.message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const role = userData?.role;
  const showMoodButtons = role === "user" && messages.length <= 1;
  const showQuickActions = QUICK_ACTIONS[role] && messages.length <= 1;

  return (
    <>
      {/* backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998] md:hidden"
        onClick={onClose}
      />

      {/* chat panel */}
      <div
        className={`fixed bottom-0 right-0 z-[9999] w-full md:w-[380px] h-[85vh] md:h-[80vh] md:bottom-6 md:right-6 bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-orange-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <BsRobot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Foody AI</h3>
              <p className="text-white/80 text-xs">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg border border-white/30 outline-none cursor-pointer"
            >
              <option value="gemini" className="text-gray-800">Gemini</option>
              <option value="groq" className="text-gray-800">Groq</option>
            </select>
            <button
              onClick={clearChat}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Clear chat"
            >
              <IoTrash size={14} className="text-white" />
            </button>
            <button
              onClick={onClose}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Close"
            >
              <IoClose size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-orange-50/50 to-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white rounded-br-md"
                    : "bg-white text-gray-800 shadow-md border border-orange-100 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <IoSparkles size={12} className="text-[#ff4d2d]" />
                    <span className="text-[10px] font-bold text-[#ff4d2d] uppercase tracking-wide">
                      Foody AI
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-orange-100">
                <div className="flex items-center gap-1.5">
                  <IoSparkles size={12} className="text-[#ff4d2d] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#ff4d2d] uppercase tracking-wide mr-1">
                    Foody AI
                  </span>
                </div>
                <div className="flex gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* mood buttons for user */}
        {showMoodButtons && (
          <div className="px-4 py-3 border-t border-orange-100 bg-white shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const MoodIcon = mood.icon;
                return (
                  <button
                    key={mood.key}
                    onClick={() => handleMoodSelect(mood)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${mood.color} text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md`}
                  >
                    <MoodIcon size={12} />
                    {mood.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* quick actions for owner/delivery boy */}
        {showQuickActions && !showMoodButtons && (
          <div className="px-4 py-3 border-t border-orange-100 bg-white shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS[role]?.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <ActionIcon size={12} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* input area */}
        <div className="p-3 border-t border-orange-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 rounded-full border border-orange-200 bg-orange-50/50 text-sm outline-none focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-full transition-all ${
                inputText.trim() && !isLoading
                  ? "bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AiChatPanel;
