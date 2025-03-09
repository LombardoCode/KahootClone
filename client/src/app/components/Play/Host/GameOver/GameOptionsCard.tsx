import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

interface GameOptionsCardProps {
  className?: string;
}

const GameOptionsCard = ({ className }: GameOptionsCardProps) => {
  const router = useRouter();

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
          delay: 12,
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
          <ClickableOption actions={() => router.push('/dashboard')}>Go to homepage</ClickableOption>
        </div>
      </div>
    </motion.div>
  )
}

interface ClickableOptionProps {
  children: React.ReactNode;
  actions: () => void;
}

const ClickableOption = ({ children, actions }: ClickableOptionProps) => {
  return (
    <div className="rounded-md">
      <Button
        backgroundColor={`bg-kahoot-purple-variant-4 hover:bg-kahoot-purple-variant-2`}
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        animateOnHover={false}
        size={ButtonSize.MEDIUM}
        perspective={false}
        className={`flex justify-between items-center w-full`}
        onClick={actions}
      >
        {children}
      </Button>
    </div>
  )
}

export default GameOptionsCard;
