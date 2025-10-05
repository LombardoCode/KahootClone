import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { kickingTheHost } from "@/app/utils/Lobby/lobbyUtils";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface GameOptionsCardProps {
  className?: string;
}

const GameOptionsCard = ({ className }: GameOptionsCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { terminateGameSession } = useInGameStore();

  const endTheGame = () => {
    terminateTheHostConnectionFromTheLobbyAndRedirectToHomepage();
  }

  const terminateTheHostConnectionFromTheLobbyAndRedirectToHomepage = () => {
    // Ending the host connection will trigger the LobbyHub's "OnDisconnectedAsync" method, which will trigger the "OnHostAbandonedTheGame" handler, which will cause the connected players to end their connections as well.
    terminateGameSession()
      .finally(() => {
        kickingTheHost(pathname, router);
    });
  }

  return (
    <>
      {/* Mobile: Bottom sheet modal */}
      <motion.div
        id="game-options-content-mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-kahoot-purple-variant-3 rounded-t-3xl shadow-2xl z-50 overflow-hidden"
        initial={{
          y: "100%"
        }}
        animate={{
          y: 0
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <div className="flex flex-col items-center py-4 px-6">
          <div
            id="clickable-options-wrapper"
            className="w-full"
          >
            <ClickableOption
              onClick={() => endTheGame()}
            >
              Go to homepage
            </ClickableOption>
          </div>
        </div>
      </motion.div>

      {/* Desktop: Sidebar */}
      <motion.div
        id="game-options-content-desktop"
        className={`hidden lg:flex justify-center bg-kahoot-purple-variant-3 py-4 z-10 overflow-hidden ${className}`}
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
            id="logo-game-options-card"
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
    </>
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
        perspective={PerspectiveSize.NO_PERSPECTIVE}
        className={`flex justify-between items-center w-full`}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}

export default GameOptionsCard;
