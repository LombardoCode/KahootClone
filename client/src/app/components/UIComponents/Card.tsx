import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: CardBackgroundColors;
  onClick?: (e?: any) => void;
}

export enum CardBackgroundColors {
  BLACK = "bg-black border-gray-800",
  WHITE = "bg-white border-gray-300"
}

const Card = ({ children, className, backgroundColor = CardBackgroundColors.WHITE, onClick }: CardProps) => {
  return (
    <div
      className={`border-1 px-4 py-3 shadow-xl ${backgroundColor} ${className}`}
      onClick={onClick}
    >
      { children }
    </div>
  )
}

export default Card;
