import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Discover/RecentlyPlayedKahoots.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Logo, { LogoColors, LogoSize } from "../../../Logo";

export enum DiscoverKahootCardSize {
  SMALL = "col-span-1",
  MEDIUM = "col-span-2"
}

interface DiscoverKahootCardProps {
  cardSize: DiscoverKahootCardSize;
  kahoot: DiscoverKahootCardInfo;
}

const DiscoverKahootCard = ({ cardSize, kahoot }: DiscoverKahootCardProps) => {
  const { imgRef, facColor, bgColor } = useAverageImageColor();

  return (
    <div
      className={`flex flex-col justify-start items-end rounded-md h-[12rem] overflow-hidden ${cardSize} ring-1 ring-zinc-300 shadow`}
      style={{ backgroundColor: kahoot.mediaUrl ? bgColor : "rgb(255, 255, 255)" }}
    >
      {kahoot.mediaUrl ? (
        <img
          ref={imgRef}
          src={kahoot.mediaUrl}
          crossOrigin="anonymous"
          className="top-0 left-0 w-full min-h-32 object-cover"
        />
      ) : (
        <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-full min-h-32">
          <Logo
            size={LogoSize.SMALL}
            color={LogoColors.WHITE}
          />
        </div>
      )}

      <div className="discover-kahoot-card-text w-full h-full px-2 py-1">
        <Text
          textColor={facColor?.isDark ? TextColors.WHITE : TextColors.GRAY}
          useCase={UseCases.LONGTEXT}
          fontWeight={FontWeights.BOLD}
          className={`z-20 text-sm w-full overflow-hidden text-ellipsis line-clamp-2 ${facColor?.isDark ? 'text-shadow-sm shadow-black' : ''}`}
        >
          {kahoot.title}
        </Text>
      </div>
    </div>
  )
}

export default DiscoverKahootCard;
