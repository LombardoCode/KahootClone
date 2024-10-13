import { motion } from "framer-motion";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

const ShowingQuestionTitleAndProgressBarCountdown = () => {
  return (
    <div className="absolute flex flex-col items-center top-0 h-full w-full">
      <motion.div
        id="question-title-card"
        initial={{
          scale: 0,
          top: '50%',
          translateY: '-50%'
        }}
        animate={{
          scale: 1
        }}
        transition={{
          duration: 0.5
        }}
        className="absolute bg-white px-5 py-4 rounded-md shadow-md shadow-black/20"
      >
        <Text
          useCase={UseCases.LONGTEXT}
          textColor={TextColors.GRAY}
          fontWeight={FontWeights.BOLD}
          className="text-4xl"
        >
          Question title goes here
        </Text>
      </motion.div>

      <div className="absolute flex bottom-28 w-full h-10 px-20">
        <motion.div
          id="loading-progress-bar"
          className="relative text-center bg-purple-800 py-3 rounded-full mt-3"
          initial={{
            opacity: 1,
            width: '0%',
            left: '0%',
          }}
          animate={{
            flex: 1
          }}
          transition={{
            duration: 4,
            ease: "easeIn"
          }}
        >
        </motion.div>
      </div>
    </div>
  )
}

export default ShowingQuestionTitleAndProgressBarCountdown;
