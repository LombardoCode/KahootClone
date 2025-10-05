import Text from "@/app/components/UIComponents/Text"
import { Player } from "@/app/interfaces/Play/Player.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface"
import useInGameStore from "@/app/stores/Kahoot/useInGameStore"
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DisplayScoreboardProps {
  nextButton?: React.ReactNode;
}

const DisplayScoreboard = ({ nextButton }: DisplayScoreboardProps) => {
  const { players } = useInGameStore();

  return (
    <div>
      <div className="relative w-full flex justify-center">
        <div className="mt-10 bg-white px-7 py-4 rounded-md shadow-md shadow-black/20 text-center">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            useCase={UseCases.LONGTEXT}
            className="text-3xl"
          >
            Scoreboard
          </Text>
        </div>
      </div>

      {nextButton && (
        <div className="flex justify-end mt-4 px-4">
          {nextButton}
        </div>
      )}

      <div id="list-of-players-and-their-earned-points" className="mt-10">
        {/* Displaying the players in descending order based on their earned points */}
        {players.sort((a, b) => b.earnedPoints - a.earnedPoints).map((player: Player, index: number) => (
          <PlayerStatsAsIndividualItemList
            key={index}
            player={player}
          />
        ))}
      </div>
    </div>
  )
}

interface PlayerStatsAsIndividualItemListProps {
  player: Player;
}

const PlayerStatsAsIndividualItemList = ({ player }: PlayerStatsAsIndividualItemListProps) => {
  return (
    <div className="flex justify-between items-center bg-purple-800 px-5 py-2 rounded-md mb-3">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faUser}
          size={"1x"}
          color={"white"}
          className="mr-3"
        />

        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-xl"
        >
          {player.name}
        </Text>
      </div>

      <div id="player-total-earned-points">
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-xl"
        >
          {player.earnedPoints}
        </Text>
      </div>
    </div>
  )
}

export default DisplayScoreboard;
