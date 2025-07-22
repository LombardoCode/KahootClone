import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { DiscoverKahootCardInfo } from "@/app/menu/discovery/page";

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
      className={`relative flex justify-start items-end rounded-md h-[12rem] px-4 py-4 overflow-hidden ${cardSize} ring-1 ring-zinc-300 shadow`}
      style={{ backgroundColor: bgColor }}
    >
      <img
        ref={imgRef}
        src={kahoot.bgImg}
        className="absolute top-0 left-0 w-full"
      />
      <Text
        textColor={facColor?.isDark ? TextColors.WHITE : TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        fontWeight={FontWeights.BOLD}
        className={`z-20 text-sm w-full overflow-hidden text-ellipsis line-clamp-2 ${facColor?.isDark ? 'text-shadow shadow-black/80' : ''}`}
      >
        {kahoot.title}
      </Text>
    </div>
  )
}

export default DiscoverKahootCard;
