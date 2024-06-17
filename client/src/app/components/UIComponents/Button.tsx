'use client'

import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";

interface ButtonProps {
  textContent: string;
  backgroundColor: BackgroundColors;
  className?: string;
  fontWeight?: FontWeights;
  onClick?: (e?: any) => void;
};

const Button = ({ textContent, backgroundColor, className, fontWeight = FontWeights.LIGHT, onClick }: ButtonProps) => {
  return (
    <button
      className={`${montserrat.className} text-white py-3 border-t-0 border-r- border-b-4 border-l-0 rounded-md hover:border-b-2 hover:translate-y-0.5 ${backgroundColor} ${fontWeight} ${className}`}
      onClick={onClick}
    >
      {textContent}
    </button>
  )
}

export default Button;
