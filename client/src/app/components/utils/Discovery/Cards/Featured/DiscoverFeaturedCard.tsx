import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { DiscoverFeaturedCardInfo } from "@/app/menu/discovery/page";

export enum DiscoverFeaturedCardSize {
  SMALL = "col-span-1",
  MEDIUM = "col-span-4"
}

interface DiscoverFeaturedCardProps {
  cardSize: DiscoverFeaturedCardSize;
  featuredKahoot: DiscoverFeaturedCardInfo;
}

const DiscoverFeaturedCard = ({ cardSize, featuredKahoot }: DiscoverFeaturedCardProps) => {
  const { imgRef, facColor, bgColor } = useAverageImageColor();

  return (
    <div
      className={`flex items-center rounded-md h-24 overflow-hidden ${cardSize} ring-1 ring-zinc-300 shadow`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-48 h-full">
        <div className="absolute bg-black/70 bottom-1 right-1 px-2 rounded-full">
          <Text
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            fontWeight={FontWeights.REGULAR}
            className={`z-20 text-xs w-full overflow-hidden text-ellipsis line-clamp-2`}
          >
            {featuredKahoot.numberOfQuestions} {featuredKahoot.numberOfQuestions === 1 ? 'question' : 'questions'}
          </Text>
        </div>
        <img
          ref={imgRef}
          src={featuredKahoot.mediaUrl}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-3">
        <Text
          textColor={facColor?.isDark ? TextColors.WHITE : TextColors.GRAY}
          useCase={UseCases.LONGTEXT}
          fontWeight={FontWeights.BOLD}
          className={`z-20 text-sm w-full overflow-hidden text-ellipsis line-clamp-2 ${facColor?.isDark ? 'text-shadow-sm shadow-black' : ''}`}
        >
          {featuredKahoot.title}
        </Text>
      </div>
    </div>
  )
}

export default DiscoverFeaturedCard;
