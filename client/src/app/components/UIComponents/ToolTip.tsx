import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "./Text";

interface TooltipProps {
  text: string;
  className?: string;
}

const Tooltip = ({ text, className }: TooltipProps) => {
  return (
    <div className={`absolute mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none ${className}`}>
      <div
        id="Tooltip-triangle"
        className="absolute w-3 h-3 bg-black rotate-45 left-1/2 -translate-x-1/2 bottom-full translate-y-1/2 z-10"
      />

      <div id="Tooltip-body" className="bg-black top-full px-2 py-1 rounded-md">
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.WHITE}
          useCase={UseCases.BODY}
          className="text-center select-none"
        >
          {text}
        </Text>
      </div>
    </div>
  )
}

export default Tooltip;
