import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import { getBackgroundColor } from "./KahootAnswerFuncs";
import IconForKahootAnswer from "./IconForKahootAnswer";

interface KahootAnswerBaseProps {
  children: React.ReactNode;
  index: number;
  isCentered?: boolean;
  showIcon?: boolean;
  onClick?: (e?: any) => void;
  className?: string;
}

const KahootAnswerBase = ({ children, index, isCentered = false, showIcon = true, onClick, className = '' }: KahootAnswerBaseProps) => {
  let backgroundColor: KahootAnswerBackgroundColors | null = getBackgroundColor(index);

  return (
    <div
      className={`px-2 rounded-md ${backgroundColor} ${className}`}
      onClick={onClick}
    >
      <div className={`flex ${isCentered ? 'justify-center items-center' : 'items-stretch'}`}>
        {showIcon
          ? <IconForKahootAnswer
            index={index}
            size={!isCentered ? 24 : 48}
            className={`${isCentered ? 'py-10 mr-2' : ''}`}
          />
          : <></>}
        {children}
      </div>
    </div>
  )
}

export default KahootAnswerBase;
