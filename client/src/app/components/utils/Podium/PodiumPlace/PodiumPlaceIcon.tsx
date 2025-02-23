import Image from 'next/image';
import Podium1stPlace from './icons/PodiumPlaceIcon_1st.svg';
import Podium2ndPlace from './icons/PodiumPlaceIcon_2nd.svg';
import Podium3rdPlace from './icons/PodiumPlaceIcon_3rd.svg';

interface PodiumPlaceIconProps {
  place: number;
}

const PodiumPlaceIcon = ({ place }: PodiumPlaceIconProps) => {
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
    <Image src={podiumPlacementIcon} alt="Podium placement icon" />
  )
}

export default PodiumPlaceIcon;
