import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext"; // adjust path if needed

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-300 
        ${
          theme === "light"
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
        }`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
