import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const SlideButton = ({
  children,
  onClick,
  icon = true,
  className = "",
  bgColor = "#ffffff",
  textColor = "#000000",
  hoverBgColor = "#2563eb", // Tailwind's blue-600
  hoverTextColor = "#ffffff",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group overflow-hidden px-6 py-3 rounded-md text-xl mt-4  transition-all duration-300 ${className}`}
      style={{
        backgroundColor: bgColor,
        color: hovered ? hoverTextColor : textColor,
        borderColor: textColor,
      }}
    >
      {/* Sliding background */}
      <span
        className="absolute inset-0 rounded-md translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"
        style={{ backgroundColor: hoverBgColor }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 transition-all duration-300">
        {children}
        {icon && (
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </button>
  );
};

export default SlideButton;
