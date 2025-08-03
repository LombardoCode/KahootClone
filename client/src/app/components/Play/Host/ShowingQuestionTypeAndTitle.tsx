import { motion } from "framer-motion";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useInGameStore from "@/app/stores/Kahoot/useInGameStore";
import { QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useState } from "react";
import GetQuestionIconBasedOnLayout from "../../utils/InGame/GetQuestionIconBasedOnLayout";
import { getTextContentForLayout } from "../../utils/Quizes/KahootQuestion.utills";

const ShowingQuestionTypeAndTitle = ({ showQuestionCountdown }: any) => {
  const { kahoot, questionIndex } = useInGameStore();
  const [currentQuestionLayout] = useState<QuizQuestionLayoutTypes | undefined>(kahoot?.questions[questionIndex].layout);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        id="showing-question-type-and-title-type-circle-wrapper"
        className="relative flex flex-col items-center w-full h-full"
      >
        <motion.div
          id="showing-question-type-and-title-type-circle"
          className="absolute flex justify-center items-center w-96 h-96 bg-black/40 rounded-full z-20"
          initial={{
            scale: 0,
            top: '40%',
            translateY: '-50%'
          }}
          animate={{
            scale: !showQuestionCountdown ? 1 : 0.3,
            top: !showQuestionCountdown ? '40%' : '0%',
            translateY: !showQuestionCountdown ? '-40%' : '-20%'
          }}
          transition={{
            duration: !showQuestionCountdown ? 0.5 : 0.4,
            ease: !showQuestionCountdown ? "backOut" : "easeInOut"
          }}
        >
          <div
            id="showing-question-type-and-title-type-circle-content"
            className="relative"
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {currentQuestionLayout && (
                <GetQuestionIconBasedOnLayout
                  layout={currentQuestionLayout}
                  className="scale-[5.3]"
                />
              )}
            </span>
          </div>
        </motion.div>

        <motion.div
          id="showing-question-type-and-title-type-label"
          className="absolute w-96 text-center bg-white py-3 rounded-full mt-3 z-10"
          initial={{
            scale: 0,
            top: '40%',
            translateY: '-40%',
          }}
          animate={{
            scale: 1,
            top: '68%',
            opacity: !showQuestionCountdown ? 1 : 0
          }}
          transition={{ duration: 0.65, ease: "backOut" }}
        >
          <Text
            useCase={UseCases.LONGTEXT}
            textColor={TextColors.BLACK}
            fontWeight={FontWeights.BOLD}
            className="text-4xl"
          >
            {getTextContentForLayout(currentQuestionLayout)}
          </Text>
        </motion.div>
      </div>
    </div>
  )
}

export default ShowingQuestionTypeAndTitle;
