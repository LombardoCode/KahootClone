import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import React from "react";

export interface InputFormProps {
  className?: string;
  type: InputFormTypes;
  textColor: TextColors;
  fontWeight: FontWeights;
  borderSize?: BorderSize;
  focusBorderColor?: FocusBorderColor;
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onEnterPress?: () => void;
  autoComplete?: boolean;
  roundness?: Roundness;
}

export enum InputFormTypes {
  TEXT = "text",
  PASSWORD = "password"
}

export enum Roundness {
  NO_ROUNDNESS = "",
  SMALL = "rounded-sm",
  MEDIUM = "rounded-md"
}

export enum BorderSize {
  NO_BORDER = "border-0",
  EXTRA_SMALL = "border-1",
  SMALL = "border-2"
};

export enum FocusBorderColor {
  BLUE = "focus:border-blue-500",
  RED = "focus:border-kahoot-red-200"
}

const InputForm = ({
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  type = InputFormTypes.TEXT,
  borderSize = BorderSize.EXTRA_SMALL,
  focusBorderColor = FocusBorderColor.BLUE,
  className,
  name,
  id,
  value,
  placeholder = '',
  onChange,
  disabled = false,
  leftElement,
  rightElement,
  onEnterPress,
  autoComplete = false,
  roundness = Roundness.MEDIUM
}: InputFormProps) => {
  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.nativeEvent as any).isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onEnterPress?.();
    }
  }

  return (
    <div className={`relative w-full`}>
      <input
        type={type}
        name={name}
        id={id}
        className={`
          ${montserrat.className}
          ${className}
          ${textColor}
          ${fontWeight}
          ${roundness}
          ${borderSize}
          ${focusBorderColor}
          ${!leftElement ? 'pl-2' : 'pl-10'}  pr-2 outline-none transition-all duration-300 placeholder-gray-500 w-full`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDownHandler}
        autoComplete={autoComplete ? "on" : "off"}
      />

      {leftElement && (
        <div className="absolute left-0 px-3 top-0 flex items-center h-full">
          {leftElement}
        </div>
      )}

      {rightElement && (
        <div className="absolute right-0 top-0 flex items-center h-full cursor-pointer">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default InputForm;