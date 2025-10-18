import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle } from "react-icons/fi";

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
      greeting: `Hello! I'm your AI assistant 

I can help you find information instantly.  
If my answers aren’t helpful, I can connect you with our team.

How can I help you today?  
Please share as much detail as possible.`,
      placeholder: "Ask a question...",
      typing: "Bot is typing...",
      team: "The team can also help",
      title: "AI Assistant",
      networkError: "⚠️ Network error, please try again later.",
      noAnswer: "Sorry, I couldn’t find an answer.",
    },
    vi: {
      greeting: `Xin chào! Tôi là trợ lý AI

Tôi có thể giúp bạn tìm thông tin ngay lập tức.  
Nếu câu trả lời của tôi chưa chính xác, tôi có thể kết nối bạn với đội ngũ hỗ trợ.

Tôi có thể giúp gì cho bạn hôm nay?  
Vui lòng chia sẻ càng chi tiết càng tốt.`,
      placeholder: "Đặt câu hỏi...",
      typing: "Bot đang trả lời...",
      team: "Đội ngũ hỗ trợ luôn sẵn sàng",
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
    setMessages([{ from: "bot", text: t[lang].greeting }]);
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
  }, [messages, loading]);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-[#0A1C2E] text-white p-4 rounded-full shadow-md shadow-white hover:bg-gray-800 transition-all duration-300 z-[999]"
        >
          <FiMessageCircle size={22} color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 md:w-full w-[90%] max-w-sm h-[600px] z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div>
                <img src="/logo/logo.png" alt="Logo" className="w-12" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  {t[lang].title}
                </h4>
                <p className="text-xs text-gray-500 !mb-0">{t[lang].team}</p>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#f9fafb] space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-xs italic">
                {t[lang].typing}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-200 p-3 bg-white">
            <input
              type="text"
              value={input}
              placeholder={t[lang].placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="p-2 bg-[#0A1C2E] text-white rounded-full hover:bg-gray-800"
            >
              <FiSend size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
