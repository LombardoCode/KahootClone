import React from "react";
import { Roundness } from "./InputForm";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: CardBackgroundColors;
  onClick?: (e?: any) => void;
  roundness?: Roundness;
}

export enum CardBackgroundColors {
  BLACK = "bg-black border-gray-800",
  WHITE = "bg-white border-gray-300",
  GRAY = "bg-gray-900 border-gray-900"
}

const Card = ({
  children,
  className,
  backgroundColor = CardBackgroundColors.WHITE,
  onClick,
  roundness = Roundness.MEDIUM
}: CardProps) => {
  return (
    <div
      className={`border-1 px-4 py-3 shadow-xl ${backgroundColor} ${roundness} ${className}`}
      onClick={onClick}
    >
      { children }
    </div>
  )
}

export default Card;
