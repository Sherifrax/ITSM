import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  className = ""
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg transition-colors ${
        disabled 
          ? "bg-gray-300 cursor-not-allowed" 
          : "bg-blue-500 hover:bg-blue-600 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}
