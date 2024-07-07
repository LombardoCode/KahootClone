'use client'

import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";

interface ButtonProps {
  children: React.ReactNode;
  backgroundColor: BackgroundColors;
  className?: string;
  fontWeight?: FontWeights;
  textColor?: TextColors;
  borderColor?: BorderColors | string;
  animateOnHover?: boolean;
  perspective?: boolean;
  size?: ButtonSize;
  onClick?: (e?: any) => void;
};

export enum ButtonSize {
  SMALL = "px-3 py-2",
  MEDIUM = "px-5 py-3"
}

export enum BorderColors {
  GRAY = "ring-1 ring-slate-600"
}

const Button = ({ children, backgroundColor, className, perspective = true, size = ButtonSize.MEDIUM, animateOnHover = true, fontWeight = FontWeights.LIGHT, textColor = TextColors.BLACK, borderColor = "", onClick }: ButtonProps) => {
  return (
    <button
      className={`${montserrat.className} ${size} border-t-0 border-r-0 ${perspective ? 'border-b-4' : ''} border-l-0 rounded-md my-2 ${backgroundColor} ${fontWeight} ${textColor} ${borderColor} ${className} ${animateOnHover ? 'hover:translate-y-0.5 hover:border-b-2' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;
