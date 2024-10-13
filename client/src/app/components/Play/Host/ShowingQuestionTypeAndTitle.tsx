import { motion } from "framer-motion";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

const ShowingQuestionTypeAndTitle = ({ showQuestionCountdown }: any) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        id="showing-question-type-and-title-type-circle-wrapper"
        className="relative flex flex-col items-center w-full h-full"
      >
        <motion.div
          id="showing-question-type-and-title-type-circle"
          className="absolute flex justify-center items-center w-48 h-48 bg-black/40 rounded-full"
          initial={{
            scale: 0,
            top: '40%',
            translateY: '-50%'
          }}
          animate={{
            scale: !showQuestionCountdown ? 1 : 0.7,
            top: !showQuestionCountdown ? '40%' : '0%',
            translateY: !showQuestionCountdown ? '-40%' : '10%'
          }}
          transition={{
            duration: !showQuestionCountdown ? 0.5 : 0.4,
            ease: !showQuestionCountdown ? "backOut" : "easeInOut"
          }}
        >
          <div
            id="showing-question-type-and-title-type-circle-content"
          >
            <span>Quiz logo</span>
          </div>
        </motion.div>

        <motion.div
          id="showing-question-type-and-title-type-label"
          className="absolute w-96 text-center bg-black/40 py-3 rounded-full mt-3"
          initial={{
            scale: 0,
            top: '40%',
            translateY: '-40%',
          }}
          animate={{
            scale: 1,
            top: '56%',
            opacity: !showQuestionCountdown ? 1 : 0
          }}
          transition={{ duration: 0.65, ease: "backOut" }}
        >
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.WHITE}
            fontWeight={FontWeights.BOLD}
            className="text-4xl"
          >
            Quiz
          </Text>
        </motion.div>
      </div>
    </div>
  )
}

export default ShowingQuestionTypeAndTitle;
