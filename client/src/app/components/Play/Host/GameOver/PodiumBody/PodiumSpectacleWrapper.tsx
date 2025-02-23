import { motion } from "framer-motion";
import { useState } from "react";

interface PodiumSpectacleWrapperProps {
  timeToWaitForPodiumPlayersToShowUp: number;
  isConfettiSpawning: (val: boolean) => void;
}

const PodiumSpectacleWrapper = ({ timeToWaitForPodiumPlayersToShowUp, isConfettiSpawning }: PodiumSpectacleWrapperProps) => {
  const [vanishCircle, setVanishCircle] = useState<boolean>(false);
  const circleMaxScale: number = 10;

  // Circle positions
  const backgroundPositions = [
    "-20% 100%",
    "20% 80%",
    "80% 20%",
    "20% 30%",
    "70% 70%",
    "50% 50%",
    "50% 50%"
  ];

  // Circle sizes for every position
  const circleScales = [1, 1.2, 1.1, 1.3, 1.2, 1, 1];

  const startVanishingTheCircle = () => {
    setVanishCircle(true);
    isConfettiSpawning(true);
  };

  return (
    <motion.div
      id="spectacle-wrapper"
      className="fixed top-0 left-0 w-full h-screen z-30"
      initial={{
        scale: 1,
        opacity: 0,
      }}
      animate={{
        backgroundPosition: backgroundPositions,
        scale: !vanishCircle ? circleScales : circleMaxScale,
        opacity: 0.8,
      }}
      transition={{
        duration: !vanishCircle ? timeToWaitForPodiumPlayersToShowUp - 0.2 : 1,
        repeat: 0,
        ease: "easeInOut",
        opacity: {
          duration: 0.5,
          ease: "easeInOut",
        },
        scale: {
          duration: !vanishCircle ? timeToWaitForPodiumPlayersToShowUp - 0.2 : 1,
          ease: "easeInOut",
        },
      }}
      style={{
        backgroundImage: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(0,0,0,0) 120px, rgba(0,0,0,0.8) 0%)`,
        backgroundSize: "200% 200%",
      }}
      onAnimationComplete={() => startVanishingTheCircle()}
    />
  );
};

export default PodiumSpectacleWrapper;