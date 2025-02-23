import PodiumPlace from "./PodiumPlace";
import { motion } from "framer-motion";
import PodiumSpectacleWrapper from "./PodiumSpectacleWrapper";

interface PodiumBodyProps {
  timeToWaitForPodiumPlayersToShowUp: number;
  isConfettiSpawning: (val: boolean) => void;
}

const PodiumBody = ({ timeToWaitForPodiumPlayersToShowUp, isConfettiSpawning }: PodiumBodyProps) => {
  return (
    <>
      <PodiumSpectacleWrapper
        timeToWaitForPodiumPlayersToShowUp={timeToWaitForPodiumPlayersToShowUp}
        isConfettiSpawning={isConfettiSpawning}
      />

      <div
        id="kahoot-podium-content-wrapper"
        className="w-full flex items-end justify-center h-full bg-purple-500/50"
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
          className="relative flex items-end bg-red-500"
        >
          <PodiumPlace place={1} className="order-2" />
          <PodiumPlace place={2} className="order-1" />
          <PodiumPlace place={3} className="order-3" />
        </motion.div>
      </div>
    </>
  )
}

export default PodiumBody;
