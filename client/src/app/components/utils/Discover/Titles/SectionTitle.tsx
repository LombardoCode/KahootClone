import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface"
import Text from "../../../UIComponents/Text"

interface SectionTitleProps {
  children: React.ReactNode;
  size?: SectionTitleSizes;
  className?: string;
}

export enum SectionTitleSizes {
  LARGE = "text-2xl",
  MEDIUM = "text-xl",
  SMALL = "text-lg"
}

const SectionTitle = ({ children, size = SectionTitleSizes.MEDIUM, className = "" }: SectionTitleProps) => {
  return (
    <Text
      fontWeight={FontWeights.BOLD}
      useCase={UseCases.HEADER}
      textColor={TextColors.BLACK}
      className={`${size} ${className}`}
    >
      {children}
    </Text>
  )
}

export default SectionTitle;
