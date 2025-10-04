import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Logo, { LogoColors, LogoSize } from "../../../Logo";

export enum DiscoverKahootCardSize {
  SMALL = "col-span-1",
  MEDIUM = "col-span-2"
}

interface DiscoverKahootCardProps {
  cardSize: DiscoverKahootCardSize;
  kahoot: DiscoverKahootCardInfo;
  onClick: (kahootId: string) => void;
}

const DiscoverKahootCard = ({ cardSize, kahoot, onClick }: DiscoverKahootCardProps) => {
  const { imgRef, facColor, bgColor } = useAverageImageColor();

  return (
    <div
      className={`flex flex-col justify-start items-end rounded-md h-[15.5rem] overflow-hidden ring-1 ring-zinc-300 shadow cursor-pointer transition hover:scale-[1.03] ${cardSize}`}
      style={{ backgroundColor: kahoot.mediaUrl ? bgColor : "rgb(255, 255, 255)" }}
      onClick={() => onClick(kahoot.kahootId)}
    >
      {kahoot.mediaUrl ? (
        <img
          ref={imgRef}
          src={kahoot.mediaUrl}
          crossOrigin="anonymous"
          className="top-0 left-0 w-full min-h-[10.5rem] object-cover"
        />
      ) : (
        <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-full min-h-[10.5rem]">
          <Logo
            id="logo-discover-kahoot-card"
            size={LogoSize.SMALL}
            color={LogoColors.WHITE}
          />
        </div>
      )}

      <div className="discover-kahoot-card-text w-full h-full px-2 pt-1 pb-2 flex flex-col justify-between">
        <div id="kahoot-title" className="">
          <Text
            textColor={facColor?.isDark ? TextColors.WHITE : TextColors.GRAY}
            useCase={UseCases.LONGTEXT}
            fontWeight={FontWeights.BOLD}
            className={`z-20 text-sm w-full overflow-hidden text-ellipsis line-clamp-2 ${facColor?.isDark ? 'text-shadow-sm shadow-black' : ''}`}
          >
            {kahoot.title}
          </Text>
        </div>

        <div id="kahoot-owner-details">
          <div id="kahoot-owner-username">
            <Text
              textColor={facColor?.isDark ? TextColors.WHITE : TextColors.GRAY}
              useCase={UseCases.LONGTEXT}
              fontWeight={FontWeights.REGULAR}
              className={`z-20 text-xs w-full overflow-hidden text-ellipsis line-clamp-2 ${facColor?.isDark ? 'text-shadow-sm shadow-black' : ''}`}
            >
              {kahoot.createdByUserName}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverKahootCard;
