import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import { QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import IconForKahootAnswer from "../Quizes/IconForKahootAnswer";

interface GetQuestionIconBasedOnLayoutProps {
  layout: QuizQuestionLayoutTypes;
  className?: string;
}

const GetQuestionIconBasedOnLayout = ({ layout, className = "" }: GetQuestionIconBasedOnLayoutProps): React.ReactNode => {
  if (layout === null || layout === undefined) {
    return <></>
  }
  
  return (
    <div className={`w-11 h-[4.5rem] overflow-hidden -rotate-[20deg] ${className}`}>
      <RenderPhone>
        <RenderIcon layout={layout} />
      </RenderPhone>
    </div>
  );
}

interface RenderPhoneProps {
  children: React.ReactNode;
}

const RenderPhone = ({ children }: RenderPhoneProps) => {
  return (
    <div className="w-full h-full px-[0.2rem] pt-[0.2rem] pb-[0.5rem] bg-gray-900 rounded-sm">
      <div className="w-full h-full px-[0.2rem] py-[0.2rem] bg-white">
        {children}
      </div>
    </div>
  )
}

interface RenderIconProps {
  layout: QuizQuestionLayoutTypes;
}

const RenderIcon = ({ layout }: RenderIconProps) => {
  switch (layout) {
    case QuizQuestionLayoutTypes.CLASSIC:
      return <ClassicLayoutIcon />;
    case QuizQuestionLayoutTypes.TRUE_OR_FALSE:
      return <TrueOrFalseLayoutIcon />
    default:
      return <></>
  }
}

const ClassicLayoutIcon = () => {
  return (
    <div className="grid grid-cols-2 w-full h-full gap-[0.1rem]">
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.RED}`}>
        <IconForKahootAnswer index={0} size={10} />
      </div>
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.BLUE}`}>
        <IconForKahootAnswer index={1} size={10} />
      </div>
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.YELLOW}`}>
        <IconForKahootAnswer index={2} size={10} />
      </div>
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.GREEN}`}>
        <IconForKahootAnswer index={3} size={10} />
      </div>
    </div>
  )
}

const TrueOrFalseLayoutIcon = () => {
  return (
    <div className="grid grid-cols-2 w-full h-full gap-[0.1rem]">
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.RED}`}>
        <IconForKahootAnswer index={0} size={10} />
      </div>
      <div className={`col-span-1 w-full h-full flex justify-center items-center ${KahootAnswerBackgroundColors.BLUE}`}>
        <IconForKahootAnswer index={1} size={10} />
      </div>
    </div>
  )
}

export default GetQuestionIconBasedOnLayout;
