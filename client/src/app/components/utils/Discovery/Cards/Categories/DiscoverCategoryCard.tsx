import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverCategoryCardInfo } from "@/app/interfaces/Kahoot/Discover/DiscoverCategoryCardInfo";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div
      className={`relative flex justify-start items-end rounded-md h-[8rem] px-4 py-4 overflow-hidden cursor-pointer transition hover:scale-105 ${cardSize}`}
      onClick={() => router.push(`${ROUTES.CATEGORIES}/${category.slug}`)}
    >
      <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/40" />
      <img
        ref={imgRef}
        src={category.mediaUrl}
        crossOrigin="anonymous"
        className="absolute top-0 left-0 w-full min-h-32 object-cover"
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
