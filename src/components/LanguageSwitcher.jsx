
import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vn', label: 'Vietnamese' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const switchLanguage = (code) => {
    setCurrentLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <Globe size={16} className="mr-2" />
        {languages.find((lang) => lang.code === currentLanguage)?.label}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <ul className="py-1">
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  onClick={() => switchLanguage(language.code)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentLanguage === language.code
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {language.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;