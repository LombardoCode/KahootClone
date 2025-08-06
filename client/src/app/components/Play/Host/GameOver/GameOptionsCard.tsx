import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import SoundBank from "@/app/singletons/SoundBank";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

interface GameOptionsCardProps {
  className?: string;
}

const GameOptionsCard = ({ className }: GameOptionsCardProps) => {
  const router = useRouter();
  const { signalRConnection } = useInGameStore();

  const endTheGame = () => {
    terminateTheHostConnectionFromTheLobbyAndRedirectToHomepage();
  }

  const terminateTheHostConnectionFromTheLobbyAndRedirectToHomepage = () => {
    // Ending the host connection will trigger the LobbyHub's "OnDisconnectedAsync" method, which will trigger the "OnHostAbandonedTheGame" handler, which will cause the connected players to end their connections as well.
    if (signalRConnection) {
      signalRConnection.stop().then(() => {
        SoundBank.stopPodiumBackgroundMusic();
        router.push(ROUTES.MENU.DISCOVERY);
      });
    }
  }

  return (
    <motion.div
      id="game-options-content"
      className={`flex justify-center bg-kahoot-purple-variant-3 py-4 z-10 overflow-hidden ${className}`}
      initial={{
        width: 0
      }}
      animate={{
        width: 384
      }}
      transition={{
        width: {
          duration: 1.4,
          delay: 0,
          ease: "easeInOut"
        }
      }}
    >
      <div className="flex flex-col items-center w-[calc(100%-2rem)]">
        <Logo
          color={LogoColors.WHITE}
          size={LogoSize.REGULAR}
        />

        <div
          id="clickable-options-wrapper"
          className="mt-4 w-full"
        >
          <ClickableOption
            onClick={() => endTheGame()}
          >
            Go to homepage
          </ClickableOption>
        </div>
      </div>
    </motion.div>
  )
}

interface ClickableOptionProps {
  children: React.ReactNode;
  onClick: () => void;
}

const ClickableOption = ({ children, onClick }: ClickableOptionProps) => {
  return (
    <div className="rounded-md">
      <Button
        backgroundColor={`bg-kahoot-purple-variant-4 hover:bg-kahoot-purple-variant-2`}
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        animateOnHover={false}
        size={ButtonSize.MEDIUM}
        perspective={PerspectiveSize.MEDIUM}
        className={`flex justify-between items-center w-full`}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}

export default GameOptionsCard;
