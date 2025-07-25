import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { DiscoverCategoryCardInfo } from "@/app/menu/discovery/page";

export enum DiscoverCategoryCardSize {
  SMALL = "col-span-1",
  MEDIUM = "col-span-2"
}

interface DiscoverCategoryCardProps {
  cardSize: DiscoverCategoryCardSize;
  category: DiscoverCategoryCardInfo;
}

const DiscoverCategoryCard = ({ cardSize, category }: DiscoverCategoryCardProps) => {
  const { imgRef, facColor } = useAverageImageColor();

  return (
    <div
      className={`relative flex justify-start items-end rounded-md h-[8rem] px-4 py-4 overflow-hidden ${cardSize}`}
    >
      <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/40" />
      <img
        ref={imgRef}
        src={category.mediaUrl}
        crossOrigin="anonymous"
        className="absolute top-0 left-0 w-full"
      />
      <Text
        textColor={TextColors.WHITE}
        useCase={UseCases.BODY}
        fontWeight={FontWeights.BOLD}
        className={`absolute z-20 text-shadow shadow-black/80 ${facColor?.isDark ? 'text-shadow shadow-black/80' : ''}`}
      >
        {category.title}
      </Text>
    </div>
  )
}

export default DiscoverCategoryCard;
