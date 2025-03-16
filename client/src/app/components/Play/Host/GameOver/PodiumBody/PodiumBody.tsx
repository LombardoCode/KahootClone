import PodiumPlace from "./PodiumPlace";
import { motion } from "framer-motion";
import PodiumSpectacleWrapper from "./PodiumSpectacleWrapper";
import { Player } from "@/app/interfaces/Play/Player.interface";
import { useEffect, useState } from "react";

interface PodiumBodyProps {
  timeToWaitForPodiumPlayersToShowUp: number;
  isConfettiSpawning: (val: boolean) => void;
  players: Player[];
}

const PodiumBody = ({ timeToWaitForPodiumPlayersToShowUp, isConfettiSpawning, players }: PodiumBodyProps) => {
  const [winningPlayers, setWinningPlayers] = useState<Player[]>();

  useEffect(() => {
    let top3Players: Player[] = players.sort((a, b) => b.earnedPoints - a.earnedPoints).slice(0, 3);
    setWinningPlayers(top3Players);
  }, []);

  return (
    <>
      {winningPlayers != null && (
        <>
          <PodiumSpectacleWrapper
            timeToWaitForPodiumPlayersToShowUp={timeToWaitForPodiumPlayersToShowUp}
            isConfettiSpawning={isConfettiSpawning}
          />

          <div
            id="kahoot-podium-content-wrapper"
            className="w-full flex items-end justify-center h-full"
          >
            <motion.div
              id="podium-container"
              initial={{
                top: "100%"
              }}
              animate={{
                top: "auto"
              }}
              transition={{
                duration: 0.34,
                ease: "circOut",
                delay: timeToWaitForPodiumPlayersToShowUp
              }}
              className="relative flex items-end"
            >
              <PodiumPlace place={1} playerInfo={winningPlayers[0]} className="order-2" />
              <PodiumPlace place={2} playerInfo={winningPlayers[1]} className="order-1" />
              <PodiumPlace place={3} playerInfo={winningPlayers[2]} className="order-3" />
            </motion.div>
          </div>
        </>
      )}
    </>
  )
}

export default PodiumBody;
