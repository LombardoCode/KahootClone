import Image from "next/image";
import Text from "@/app/components/UIComponents/Text";
import useAverageImageColor from "@/app/hooks/useAverageImageColor";
import { DiscoverCategoryCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverCategoryCardInfo";
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
  const { imgRef } = useAverageImageColor();
  const router = useRouter();

  return (
    <div
      className={`relative flex justify-start items-end rounded-md h-[8rem] px-4 py-4 overflow-hidden cursor-pointer transition hover:scale-[1.03] ${cardSize}`}
      onClick={() => router.push(`${ROUTES.CATEGORIES}/${category.slug}`)}
    >
      <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/40" />
      <Image
        ref={imgRef}
        src={category.mediaUrl}
        alt={category.title}
        fill
        className="object-cover"
        loading="lazy"
      />
      <Text
        textColor={TextColors.WHITE}
        useCase={UseCases.BODY}
        fontWeight={FontWeights.BOLD}
        className={`relative z-20 text-shadow shadow-black`}
      >
        {category.title}
      </Text>
    </div>
  )
}

export default DiscoverCategoryCard;
