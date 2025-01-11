import Text from "@/app/components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { motion } from "framer-motion";

interface PodiumHeaderProps {
  hide: boolean;
}

const PodiumHeader = ({ hide }: PodiumHeaderProps) => {
  return (
    <div className="bg-green-400/40 w-full h-1/2">
      <div className="w-full px-3">
        <motion.div
          className="text-center bg-purple-900 py-1"
          initial={{
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)",
            translateY: 0
          }}
          animate={hide ? { translateY: "100vh" } : {}}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-lg"
          >
            Podium
          </Text>
        </motion.div>
      </div>
    </div>
  )
}

export default PodiumHeader;
