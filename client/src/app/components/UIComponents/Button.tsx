'use client'

import { FontWeights } from "@/app/interfaces/Text.interface";
import { Montserrat } from "next/font/google";

interface ButtonProps {
  textContent: string;
  backgroundColor: BackgroundColors;
  className?: string;
  fontWeight?: FontWeights;
  onClick: (e?: any) => void;
};

const montserrat = Montserrat({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  style: 'normal'
});

export enum BackgroundColors {
  GRAY = 'bg-gray-700 hover:bg-gray-800 border-gray-800',
  GREEN = 'bg-green-600 hover:bg-green-700 border-green-700'
}

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
