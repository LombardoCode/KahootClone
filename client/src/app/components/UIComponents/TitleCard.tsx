import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "./Text";

interface TitleCardProps {
  children: React.ReactNode;
  className?: string;
}

const TitleCard = ({ children, className = "" }: TitleCardProps) => {
  return (
    <div
      className={`title-card bg-white px-5 py-3 rounded-md shadow-md shadow-black/20 ${className}`}
    >
      <Text
        useCase={UseCases.LONGTEXT}
        textColor={TextColors.GRAY}
        fontWeight={FontWeights.BOLD}
        className="text-3xl"
      >
        {children}
      </Text>
    </div>
  )
}

export default TitleCard;
