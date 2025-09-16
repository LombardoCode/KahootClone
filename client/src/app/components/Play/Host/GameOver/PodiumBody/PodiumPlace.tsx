import Text from "@/app/components/UIComponents/Text";
import DisplayUsersPhoto from "@/app/components/utils/General/DisplayUsersPhoto";
import PodiumPlaceIcon, { PodiumPlaceIconSize } from "@/app/components/utils/Podium/PodiumPlace/PodiumPlaceIcon";
import { Player } from "@/app/interfaces/Play/Player.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PodiumPlaceProps {
  place: number;
  playerInfo: Player | undefined;
  className?: string;
}

const PodiumPlace = ({ place, playerInfo, className = '' }: PodiumPlaceProps) => {
  return (
    <div className={`${className}`}>
      {place === 1 && (
        <PodiumPlaceIndividual
          place={place}
          playerName={playerInfo?.name}
          playerPoints={playerInfo?.earnedPoints}
          playerMediaUrl={playerInfo?.mediaUrl}
          className="z-20"
        />
      )}

      {place === 2 && (
        <PodiumPlaceIndividual
          place={place}
          playerName={playerInfo?.name}
          playerPoints={playerInfo?.earnedPoints}
          playerMediaUrl={playerInfo?.mediaUrl}
          className="z-10 translate-x-3"
        />
      )}

      {place === 3 && (
        <PodiumPlaceIndividual
          place={place}
          playerName={playerInfo?.name}
          playerPoints={playerInfo?.earnedPoints}
          playerMediaUrl={playerInfo?.mediaUrl}
          className="z-0 -translate-x-3"
        />
      )}
    </div>
  )
}

interface PodiumPlaceIndividualProps {
  place: number;
  playerName: string | null | undefined;
  playerPoints: number | undefined;
  playerMediaUrl: string | null | undefined;
  className?: string;
}

const PodiumPlaceIndividual = ({ place = 0, playerName = "Unknown", playerPoints = 0, playerMediaUrl, className = "" }: PodiumPlaceIndividualProps) => {
  const podiumBarHeightsClasses: any = {
    1: 'h-[36rem]',
    2: 'h-[32rem]',
    3: 'h-[28rem]'
  };

  const podiumBarHeight = podiumBarHeightsClasses[place] || null;

  if (podiumBarHeight === null) {
    return null;
  }

  return (
    <div className={`relative bottom-0 w-[15rem] ${podiumBarHeight} ${className}`}>
      <div
        id="podium-place-individual-profile-picture-wrapper"
        className="flex justify-center mb-3 w-full top-0"
      >
        <div id="podium-place-individual-profile-picture-content">
          {!!playerMediaUrl
            ? <DisplayUsersPhoto photo={playerMediaUrl} size={"medium"} />
            : <div className="flex justify-center items-center bg-gray-500 w-28 h-28 rounded-full">
              <FontAwesomeIcon
                icon={faUser}
                color="white"
                size="3x"
              />
            </div>
          }
        </div>
      </div>

      <div className={`bg-purple-900 h-full rounded-t-xl shadow-lg shadow-black/70`}>
        <div
          id="podium-place-individual-number-of-placement-wrapper"
          className="absolute flex flex-col items-center mt-4 w-full"
        >
          <div
            id="podium-place-individual-number-of-placement-content"
            className="rounded-full"
          >
            <PodiumPlaceIcon
              place={place}
              size={PodiumPlaceIconSize.REGULAR}
            />
          </div>

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-2xl mt-2 mb-3"
          >
            {playerName}
          </Text>

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-md mb-3"
          >
            {playerPoints}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default PodiumPlace;
