import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface"
import Text from "../../../UIComponents/Text"

interface SectionTitleProps {
  children: React.ReactNode;
  size?: SectionTitleSizes;
  viewAll?: boolean;
}

export enum SectionTitleSizes {
  LARGE = "text-2xl",
  MEDIUM = "text-xl",
  SMALL = "text-lg"
}

const SectionTitle = ({ children, size = SectionTitleSizes.MEDIUM, viewAll = false }: SectionTitleProps) => {
  return (
    <div className={`${viewAll ? 'flex justify-between items-center' : ''}`}>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className={`${size}`}
      >
        {children}
      </Text>

      {viewAll && (
        <Text
          fontWeight={FontWeights.REGULAR}
          useCase={UseCases.HEADER}
          textColor={TextColors.GRAY}
          className={`${size}`}
        >
          View all
        </Text>
      )}
    </div>
  )
}

export default SectionTitle;
