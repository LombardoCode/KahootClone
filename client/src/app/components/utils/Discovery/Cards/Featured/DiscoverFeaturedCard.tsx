import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverFeaturedCardInfo";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

export enum DiscoverFeaturedCardSize {
  MEDIUM = "2xl:col-span-4 lg:col-span-6 md:col-span-12"
}

interface DiscoverFeaturedCardProps {
  cardSize: DiscoverFeaturedCardSize;
  featuredKahoot: DiscoverFeaturedCardInfo;
  onClick: (kahootId: string) => void;
}

const DiscoverFeaturedCard = ({ cardSize, featuredKahoot, onClick }: DiscoverFeaturedCardProps) => {
  const { imgRef, facColor, bgColor } = useAverageImageColor();

  return (
    <div
      className={`flex items-center rounded-md h-24 overflow-hidden ring-1 ring-zinc-300 shadow cursor-pointer transition hover:scale-[1.03] ${cardSize}`}
      style={{ backgroundColor: bgColor }}
      onClick={() => onClick(featuredKahoot.kahootId)}
    >
      <div className="relative max-w-36 h-full">
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
          className="top-0 left-0 w-full min-h-32 object-cover"
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
