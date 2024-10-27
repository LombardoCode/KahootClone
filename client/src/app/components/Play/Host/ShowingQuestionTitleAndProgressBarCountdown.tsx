import { motion } from "framer-motion";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { useEffect, useState } from "react";
import { QuestionPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";

const ShowingQuestionTitleAndProgressBarCountdown = () => {
  // Global store state
  const { kahoot, questionIndex } = useInGameStore();
  const [question, setQuestion] = useState<QuestionPlay>();

  useEffect(() => {
    if (kahoot !== null && kahoot?.questions.length > 0) {
      setQuestion(kahoot?.questions[questionIndex]);
    }
  }, [questionIndex]);

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
          {question?.title}
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
