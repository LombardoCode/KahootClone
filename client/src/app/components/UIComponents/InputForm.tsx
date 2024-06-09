import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  style: 'normal'
});

export interface TextProps {
  className?: string;
  type: InputFormTypes;
  textColor: TextColors;
  fontWeight: FontWeights;
  name: string;
  id: string;
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
  id
}: TextProps) => {
  return (
    <>
      <input
        type={`${type}`}
        name={name}
        id={id}
        className={`${montserrat.className} ${className} ${textColor} ${fontWeight} px-2 py-1 border-1 border-gray-300 focus:border-blue-500 outline-none transition-all duration-300 rounded-md`}
      />
    </>
  )
}

export default InputForm;
