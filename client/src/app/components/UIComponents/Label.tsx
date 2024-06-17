import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import { Montserrat } from "next/font/google";
import React from "react";

export interface TextProps {
  children: React.ReactNode;
  className?: string;
  textColor: TextColors;
  fontWeight: FontWeights;
  htmlFor: string;
}

const Label = ({
  children,
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  htmlFor,
  className
}: TextProps) => {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`${montserrat.className} ${className} ${textColor} ${fontWeight}`}
      >
        { children }
      </label>
    </>
  )
}

export default Label;
