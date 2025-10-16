import React from "react";
import { CheckOutlined } from "@ant-design/icons";

const CustomStepper = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="flex justify-between items-center w-full mb-8 relative">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center relative cursor-pointer"
            onClick={() => onStepChange(index)}
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-[2px] z-0
                  ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`}
              ></div>
            )}

            {/* Step circle */}
            <div
              className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${isCompleted ? "bg-blue-500 border-blue-500 text-white" : ""}
                ${isActive && !isCompleted ? "bg-[#0284C7] border-blue-500 text-white" : ""}
                ${!isCompleted && !isActive ? "border-gray-300 text-gray-400 bg-white" : ""}
              `}
            >
              {isCompleted ? <CheckOutlined className="text-xs" /> : index + 1}
            </div>

            {/* Step title */}
            <span
              className={`mt-2 text-sm font-medium ${
                isActive ? "text-[#0284C7]" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomStepper;
