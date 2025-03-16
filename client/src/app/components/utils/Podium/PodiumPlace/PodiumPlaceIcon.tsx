import Image from 'next/image';
import Podium1stPlace from './icons/PodiumPlaceIcon_1st.svg';
import Podium2ndPlace from './icons/PodiumPlaceIcon_2nd.svg';
import Podium3rdPlace from './icons/PodiumPlaceIcon_3rd.svg';
import Text from '@/app/components/UIComponents/Text';
import { FontWeights, TextColors, UseCases } from '@/app/interfaces/Text.interface';
import { ordinalNumber } from '@/app/utils/numberFormatting';

interface PodiumPlaceIconProps {
  place: number;
  size?: PodiumPlaceIconSize;
}

export enum PodiumPlaceIconSize {
  SMALL = "w-24",
  REGULAR = "w-32"
}

const PodiumPlaceIcon = ({ place, size = PodiumPlaceIconSize.REGULAR }: PodiumPlaceIconProps) => {
  const podiumIcons: any = {
    1: Podium1stPlace,
    2: Podium2ndPlace,
    3: Podium3rdPlace
  };

  const podiumPlacementIcon = podiumIcons[place] || null;

  if (!podiumPlacementIcon == null) {
    return null;
  }

  return (
    <>
      {place >= 1 && place <= 3
        ? <Image src={podiumPlacementIcon} alt="Podium placement icon" className={`${size}`} />
        : (
          <div className="bg-kahoot-purple-variant-3 py-2 px-3 rounded-lg">
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              className="text-2xl text-shadow shadow-black/60 text-center"
            >
              {ordinalNumber(place)} place
            </Text>
          </div>
        )}
    </>
  )
}

export default PodiumPlaceIcon;
