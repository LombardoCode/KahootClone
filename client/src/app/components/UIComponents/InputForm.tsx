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
  rightElement?: React.ReactNode;
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
  disabled = false,
  rightElement
}: InputFormProps) => {
  return (
    <div className={`relative w-full`}>
      <input
        type={type}
        name={name}
        id={id}
        className={`${montserrat.className} ${className} ${textColor} ${fontWeight} px-2 py-1 border-1 border-gray-400 focus:border-blue-500 outline-none transition-all duration-300 rounded-md placeholder-gray-500 w-full`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />

      {rightElement && (
        <div className="absolute right-0 top-0 flex items-center h-full cursor-pointer">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default InputForm;