import Image from "next/image";
import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverFeaturedCardInfo";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Logo, { LogoColors, LogoSize } from "../../../Logo";

export enum DiscoverFeaturedCardSize {
  MEDIUM = "2xl:col-span-4 lg:col-span-6 md:col-span-12"
}

interface DiscoverFeaturedCardProps {
  itemNumber: number;
  cardSize: DiscoverFeaturedCardSize;
  featuredKahoot: DiscoverFeaturedCardInfo;
  onClick: (kahootId: string) => void;
}

const DiscoverFeaturedCard = ({ itemNumber, cardSize, featuredKahoot, onClick }: DiscoverFeaturedCardProps) => {
  const { imgRef, bgColor } = useAverageImageColor();
  itemNumber = itemNumber + 1;

  return (
    <div className="flex items-center">
      <div className="min-w-12 max-w-12 md:min-w-14 md:max-w-14 lg:min-w-20 lg:max-w-20 flex justify-center">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.GRAY}
          useCase={UseCases.BODY}
          className="text-2xl lg:text-3xl xl:text-4xl select-none"
        >
          {itemNumber}
        </Text>
      </div>
      
      <div
        className={`flex-1 flex items-center rounded-md h-24 overflow-hidden ring-1 ring-zinc-300 shadow cursor-pointer transition hover:scale-[1.03] ${cardSize}`}
        style={{ backgroundColor: featuredKahoot.mediaUrl ? bgColor : "rgb(255, 255, 255)" }}
        onClick={() => onClick(featuredKahoot.kahootId)}
      >
        <div className="relative min-w-36 max-w-36 h-full">
          <div className="absolute bg-black/70 bottom-1 right-1 px-2 rounded-full">
            <Text
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              fontWeight={FontWeights.REGULAR}
              className={`text-xs w-full overflow-hidden text-ellipsis line-clamp-2`}
            >
              {featuredKahoot.numberOfQuestions} {featuredKahoot.numberOfQuestions === 1 ? 'question' : 'questions'}
            </Text>
          </div>

          <div className="flex items-center h-24">
            {featuredKahoot.mediaUrl ? (
              <div className="relative w-36 h-24">
                <Image
                  ref={imgRef}
                  src={featuredKahoot.mediaUrl}
                  alt={featuredKahoot.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-full h-24">
                <Logo
                  id="logo-discover-featured-kahoot-card"
                  size={LogoSize.SMALL}
                  color={LogoColors.WHITE}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative flex-1 h-full px-3 flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 pointer-events-none" />
          <div id="kahoot-title" className="mb-2 relative z-10">
            <Text
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              fontWeight={FontWeights.BOLD}
              className={`text-sm w-full overflow-hidden text-ellipsis line-clamp-2 text-shadow-sm shadow-black`}
            >
              {featuredKahoot.title}
            </Text>
          </div>

          <div id="kahoot-owner-details" className="relative z-10">
            <div id="kahoot-owner-username">
              <Text
                textColor={TextColors.WHITE}
                useCase={UseCases.LONGTEXT}
                fontWeight={FontWeights.REGULAR}
                className={`z-20 text-xs w-full overflow-hidden text-ellipsis line-clamp-2 text-shadow-sm shadow-black`}
              >
                {featuredKahoot.createdByUserName}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverFeaturedCard;
