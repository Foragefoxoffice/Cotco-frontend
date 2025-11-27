"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle, FiMinimize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 🧠 Multi-language translations
  const t = {
    en: {
      greeting: `Hello! I'm your AI assistant.
      
I can help you find information instantly.
If my answers aren’t helpful, I can connect you with our team.

How can I help you today?`,
      placeholder: "Type your question...",
      typing: "Thinking...",
      team: "Online Support",
      title: "AI Assistant",
      networkError: "⚠️ Network error, please try again later.",
      noAnswer: "Sorry, I couldn’t find an answer.",
    },
    vi: {
      greeting: `Xin chào! Tôi là trợ lý AI.

Tôi có thể giúp bạn tìm thông tin ngay lập tức.
Nếu câu trả lời của tôi chưa chính xác, tôi có thể kết nối bạn với đội ngũ hỗ trợ.

Tôi có thể giúp gì cho bạn hôm nay?`,
      placeholder: "Nhập câu hỏi của bạn...",
      typing: "Đang suy nghĩ...",
      team: "Hỗ trợ trực tuyến",
      title: "Trợ Lý AI",
      networkError: "⚠️ Lỗi mạng, vui lòng thử lại sau.",
      noAnswer: "Xin lỗi, tôi không tìm thấy câu trả lời.",
    },
  };

  // 🕹 Detect site language
  useEffect(() => {
    const detectLang = () => {
      if (document.body.classList.contains("vi-mode")) {
        setLang("vi");
      } else {
        setLang(localStorage.getItem("lang") || "en");
      }
    };

    detectLang();

    const observer = new MutationObserver(detectLang);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("languageChange", detectLang);
    return () => {
      observer.disconnect();
      window.removeEventListener("languageChange", detectLang);
    };
  }, []);

  // 🟢 Initialize messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ from: "bot", text: t[lang].greeting }]);
    }
  }, [lang]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.cotco-vn.com/api/v1/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, lang }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data?.answer || t[lang].noAnswer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: t[lang].networkError },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-[#0A1C2E] !text-white p-4 rounded-full shadow-lg shadow-[#0A1C2E]/30 hover:shadow-[#0A1C2E]/50 transition-shadow z-[999] flex items-center justify-center"
          >
            <FiMessageCircle size={28} />
            {/* Pulse Effect */}
            <span className="absolute inset-0 rounded-full animate-ping bg-[#0A1C2E] opacity-20"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed md:bottom-6 bottom-0 md:right-6 right-0 md:w-[380px] w-[100%] h-[600px] max-h-[80vh] z-[9999] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#0A1C2E] px-6 py-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <img src="/logo/logo.png" alt="Bot" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0A1C2E] rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base tracking-wide">
                    {t[lang].title}
                  </h4>
                  <p className="text-white/70 text-xs font-medium">
                    {t[lang].team}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="!text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <FiMinimize2 size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${msg.from === "user"
                      ? "bg-[#0A1C2E] text-white rounded-2xl rounded-tr-sm"
                      : "bg-white text-slate-700 border border-gray-100 rounded-2xl rounded-tl-sm"
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#0A1C2E]/60 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#0A1C2E]/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#0A1C2E]/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-full px-2 py-2 border border-gray-200 focus-within:border-[#0A1C2E] focus-within:ring-1 focus-within:ring-[#0A1C2E]/20 transition-all">
                <input
                  type="text"
                  value={input}
                  placeholder={t[lang].placeholder}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`p-3 rounded-full transition-colors ${input.trim()
                    ? "bg-[#0A1C2E] !text-white shadow-md shadow-[#0A1C2E]/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <FiSend size={18} className={input.trim() ? "ml-0.5" : ""} />
                </motion.button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">Powered by Cotco AI</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
