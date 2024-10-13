'use client'

import { useEffect, useState } from "react";
import useInGameStore from "../stores/Kahoot/useInGameStore";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import Spinner from "../components/UIComponents/Spinner";
import { motion } from "framer-motion";

const GameBlock = () => {
  const { isHost } = useInGameStore();

  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black ${!isHost ? 'opacity-50' : 'opacity-5'}`}></div>
      <div className="relative z-10 h-full">
        {isHost
          ? <Host />
          : <Guest />
        }
      </div>
    </div>
  )
}

const Host = () => {
  const [showQuestionHeader, setShowQuestionHeader] = useState<boolean>(true);
  const [showQuestionCountdown, setShowQuestionCountdown] = useState<boolean>(false);
  const [showQuestionAndAnswers, setShowQuestionAndAnswers] = useState<boolean>(false);

  useEffect(() => {
    const questionHeaderTimer = setTimeout(() => {
      setShowQuestionHeader(true);
      setShowQuestionCountdown(true);
    }, 2000);

    return () => {
      clearInterval(questionHeaderTimer);
    }
  }, [showQuestionHeader]);

  return (
    <div className="w-full">
      {showQuestionHeader && (
        <ShowingQuestionTypeAndTitle
          showQuestionCountdown={showQuestionCountdown}
        />
      )}

      {showQuestionCountdown && (
        <ShowingQuestionTitleAndProgressBarCountdown />
      )}

      {showQuestionAndAnswers && (
        <div>Showing the question title and the answers</div>
      )}
    </div>
  )
}

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

const ShowingQuestionTitle = () => {
  return (
    <div>
      ShowingQuestionTitle
    </div>
  )
}

const Guest = () => {
  return (
    <div className="relative z-10 h-full flex justify-center items-center">
      <div id="get-ready" className="w-96 flex flex-col items-center">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-4xl mb-3"
        >
          Question 1
        </Text>

        <Spinner className="mb-3" />

        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-2xl"
        >
          Ready...
        </Text>
      </div>
    </div>
  )
}

export default GameBlock;
