import { Player } from "@/app/interfaces/Play/Player.interface";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";

interface LobbyUserCardProps {
  player: Player;
  kickPlayer: (playerId: string | null | undefined) => void;
}

const LobbyUserCard = ({ player, kickPlayer }: LobbyUserCardProps) => {
  const { isHost } = useInGameStore();

  const tryKickThePlayer = (playerId: string | null | undefined) => {
    if (isHost) {
      kickPlayer(playerId)
    }
  }

  return (
    <div
      className={`flex rounded-md overflow-hidden cursor-pointer select-none ${isHost && 'hover:line-through hover:decoration-white hover:decoration-3'}`}
      onClick={() => tryKickThePlayer(player.connectionId)}
    >
      <div className="lobby-user-card-icon bg-purple-950 text-white px-4 py-5">
        <FontAwesomeIcon
          icon={faUser}
          size={"3x"}
        />
      </div>
      <div className="lobby-user-card-username bg-purple-800 flex-1 flex items-center px-4">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-xl md:text-2xl"
        >
          {player.name}
        </Text>
      </div>
    </div>
  )
}

export default LobbyUserCard;
