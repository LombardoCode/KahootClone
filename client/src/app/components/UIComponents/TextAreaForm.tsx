import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import React from "react";

export interface TextAreaFormProps {
  className?: string;
  textColor: TextColors;
  fontWeight: FontWeights;
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  cols?: number;
  rows?: number;
}

const TextAreaForm = ({
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  className,
  name,
  id,
  value,
  placeholder = '',
  onChange,
  disabled = false,
  cols = 1,
  rows = 1
}: TextAreaFormProps) => {
  return (
    <textarea
      name={name}
      id={id}
      className={`${montserrat.className} ${className} ${textColor} ${fontWeight} px-2 py-1 border border-gray-300 focus:border-blue-500 outline-none transition-all duration-300 rounded-md placeholder-gray-500`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      cols={cols}
      rows={rows}
    />
  );
};

export default TextAreaForm;
