import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import React from "react";

export interface InputFormProps {
  className?: string;
  type: InputFormTypes;
  textColor: TextColors;
  fontWeight: FontWeights;
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export enum InputFormTypes {
  TEXT = "text",
  PASSWORD = "password"
}

const InputForm = ({
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  type = InputFormTypes.TEXT,
  className,
  name,
  id,
  value,
  placeholder = '',
  onChange,
  disabled = false
}: InputFormProps) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      className={`${montserrat.className} ${className} ${textColor} ${fontWeight} px-2 py-1 border-1 border-gray-300 focus:border-blue-500 outline-none transition-all duration-300 rounded-md placeholder-gray-500`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default InputForm;