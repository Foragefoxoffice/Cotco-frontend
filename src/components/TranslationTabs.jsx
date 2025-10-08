import React from "react";

const TranslationTabs = ({ activeLanguage, setActiveLanguage }) => {
  const tabs = [
    { id: "en", label: "English (EN)" },
    { id: "vi", label: "“Tiếng Việt (VI)" },
  ];

  return (
    <div className="mb-4">
      <div className="flex bg-[#1F1F1F] rounded-full p-1 border border-[#2E2F2F] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveLanguage(tab.id)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
              activeLanguage === tab.id
                ? "bg-[#fff] !text-black shadow-md"
                : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TranslationTabs;
