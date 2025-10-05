import TitleCard from "@/app/components/UIComponents/TitleCard";
import Logo, { LogoSize } from "@/app/components/utils/Logo";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { motion } from "framer-motion";

interface PodiumKahootLogoAndKahootTitleProps {
  moveToTheTop: boolean;
  podiumHeaderDisappeared: boolean;
}

const PodiumKahootLogoAndKahootTitle = ({ moveToTheTop, podiumHeaderDisappeared }: PodiumKahootLogoAndKahootTitleProps) => {
  const { kahoot } = useInGameStore();

  return (
    <div className={`relative ${!podiumHeaderDisappeared ? 'h-1/2' : ''}`}>
      <motion.div
        className={`${!podiumHeaderDisappeared ? 'absolute' : 'relative'} w-full flex flex-col items-center max-h-min px-4`}
        initial={{
          bottom: 0,
        }}
        animate={{
          top: moveToTheTop ? "0%" : "auto",
          bottom: moveToTheTop ? "auto" : "0%",
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="flex flex-col items-center">
          {/* Mobile Logo */}
          <div className="block sm:hidden">
            <Logo
              id="logo-podium-mobile"
              size={LogoSize.SMALL}
            />
          </div>

          {/* Desktop Logo */}
          <div className="hidden sm:block">
            <Logo
              id="logo-podium"
              size={LogoSize.REGULAR}
            />
          </div>

          <TitleCard className="mt-2 text-center w-full">
            {kahoot?.title}
          </TitleCard>
        </div>
      </motion.div>
    </div>
  );
};

export default PodiumKahootLogoAndKahootTitle;
