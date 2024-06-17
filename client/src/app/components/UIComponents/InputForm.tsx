import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";
import { Montserrat } from "next/font/google";

export interface InputForm {
  className?: string;
  type: InputFormTypes;
  textColor: TextColors;
  fontWeight: FontWeights;
  name: string;
  id: string;
  value?: string;
  onChange?: (e?: any) => void;
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
  onChange
}: InputForm) => {
  return (
    <>
      <input
        type={`${type}`}
        name={name}
        id={id}
        className={`${montserrat.className} ${className} ${textColor} ${fontWeight} px-2 py-1 border-1 border-gray-300 focus:border-blue-500 outline-none transition-all duration-300 rounded-md`}
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default InputForm;
