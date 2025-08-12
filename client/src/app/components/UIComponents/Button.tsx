'use client'

import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";

interface ButtonProps {
  children: React.ReactNode;
  backgroundColor?: BackgroundColors | string;
  className?: string;
  fontWeight?: FontWeights;
  textColor?: TextColors;
  borderColor?: BorderColors | string;
  animateOnHover?: boolean;
  perspective?: PerspectiveSize;
  size?: ButtonSize;
  roundness?: ButtonRoundness;
  onClick?: (e?: any) => void;
};

export enum ButtonSize {
  EXTRA_SMALL = "px-2 py-1",
  SMALL = "px-3 py-2",
  MEDIUM = "px-5 py-3",
  LARGE = "px-8 py-6"
}

export enum BorderColors {
  GRAY = "ring-1 ring-slate-600"
}

export enum PerspectiveSize {
  NO_PERSPECTIVE = "",
  SMALL = "border-b-2",
  MEDIUM = "border-b-4"
}

export enum ButtonRoundness {
  NO_ROUNDNESS = "",
  MEDIUM = "rounded-md",
  FULL = "rounded-full"
}

const Button = ({
  children,
  backgroundColor = "",
  className,
  perspective = PerspectiveSize.NO_PERSPECTIVE,
  size = ButtonSize.MEDIUM,
  animateOnHover = true,
  fontWeight = FontWeights.LIGHT,
  textColor = TextColors.BLACK,
  borderColor = "",
  roundness = ButtonRoundness.MEDIUM,
  onClick
}: ButtonProps) => {
  return (
    <button
      className={`
        ${montserrat.className}
        ${size}
        ${perspective}
        ${roundness}
        ${backgroundColor}
        ${fontWeight}
        ${textColor}
        ${borderColor}
        ${className}
        ${animateOnHover ? 'hover:translate-y-0.5 hover:border-b-2' : ''}
        outline-none my-2`
      }
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;
