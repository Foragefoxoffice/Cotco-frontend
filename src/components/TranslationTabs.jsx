
import React from 'react';

const TranslationTabs = ({ activeLanguage, setActiveLanguage }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-4" aria-label="Translation tabs">
        <button
          onClick={() => setActiveLanguage('en')}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeLanguage === 'en'
              ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          English (EN)
        </button>
        <button
          onClick={() => setActiveLanguage('vn')}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeLanguage === 'vn'
              ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          Vietnamese (VN)
        </button>
      </nav>
    </div>
  );
};

export default TranslationTabs;