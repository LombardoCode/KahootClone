import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

const PlayerInGameStatus = () => {
  const { currentPlayer } = useInGameStore();

  return (
    <div className="get-ready-footer absolute bottom-0 w-full bg-white">
      {currentPlayer.id !== "" && (
        <div className="flex justify-between py-2 px-3">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faUser}
              size={"2xl"}
              className="mr-2"
            />
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-xl"
            >
              {currentPlayer.name}
            </Text>
          </div>

          <div className="get-ready-points-indicator bg-purple-800 px-2 py-1 rounded-md">
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              useCase={UseCases.LONGTEXT}
              className="text-xl"
            >
              {currentPlayer.earnedPoints} points
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerInGameStatus;
