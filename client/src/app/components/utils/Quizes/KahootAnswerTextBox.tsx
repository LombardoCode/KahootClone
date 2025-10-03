/**
 * Purpose:
 * This component will show the Kahoot Answer represented as an editable text-box.
 * 
 * This component is meant to be rendered on the Kahoot Creator page (the page where
 * users can create and edit their own Kahoots).
 * 
 * This component will display:
 * 
 * 1.- The Kahoot Answer Tile (with its unique background color assigned, thanks
 * to the <KahootAnswerBackgroundColorWrapper /> component).
 * 
 * 2.- The icon for the Kahoot Answer tile (thanks to the <IconForKahootAnswer /> component)
 * 
 * 3.- The editable text-box, so the Kahoot owner can assign an answer for the current
 * question that they are working on.
 * 
 * 4.- A rounded check-box to determine the correctness of the answer.
 */

import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerBackgroundColorWrapper from "./KahootAnswerBackgroundColorWrapper";
import { Answer, QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import IconForKahootAnswer from "./IconForKahootAnswer";
import TextAreaForm from "../../UIComponents/TextAreaForm";
import { useState, useRef } from "react";
import EditAnswerModal from "../Modal/reusable/mobile/EditAnswerModal";

interface KahootAnswerTextboxProps {
  className?: string;
  answerIndex: number;
  answer: Answer;
}

const KahootAnswerTextBox = ({ className, answerIndex, answer }: KahootAnswerTextboxProps) => {
  // Store
  const { kahoot, questionIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();

  // Local component
  const [isEditAnswerModalOpen, setIsEditAnswerModalOpen] = useState<boolean>(false);
  const correctnessButtonRef = useRef<HTMLDivElement>(null);
  const answerText = kahoot?.questions[questionIndex].answers[answerIndex].text || "";
  const isTheQuestionTrueOrFalse: boolean = kahoot?.questions[questionIndex].layout === QuizQuestionLayoutTypes.TRUE_OR_FALSE;

  const handleAnswerTextChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = e.target.value;
    updateAnswerText(questionIndex, answerIndex, newAnswer);
  }

  const handleAnwserCorrectnessChange = (e: React.MouseEvent, isCorrect: boolean) => {
    updateAnswerCorrectness(questionIndex, answerIndex, isCorrect);
  }

  const handleMobileCardClick = (e: React.MouseEvent) => {
    // Check if the click is on the correctness button or its children
    if (correctnessButtonRef.current && (correctnessButtonRef.current === e.target || correctnessButtonRef.current.contains(e.target as Node))) {
      return; // Don't open modal if clicking on correctness button
    }

    if (!isTheQuestionTrueOrFalse) {
      setIsEditAnswerModalOpen(true);
    }
  }

  return (
    <>
      <KahootAnswerBackgroundColorWrapper
        colorIndex={answerIndex}
        className={`relative flex items-center min-h-24 overflow-hidden lg:cursor-default cursor-pointer ${className}`}
      >
        {/* Icons */}
        <div>
          {/* Mobile */}
          <IconForKahootAnswer
            index={answerIndex}
            size={12}
            className="absolute top-0 left-0 block md:hidden py-2"
          />

          {/* Tablets */}
          <IconForKahootAnswer
            index={answerIndex}
            size={25}
            className="hidden md:block xl:hidden py-10 mr-2"
          />

          {/* Desktop */}
          <IconForKahootAnswer
            index={answerIndex}
            size={48}
            className="hidden xl:block py-10 mr-2"
          />
        </div>

        {/* Answer inputs */}
        <div className="flex-1 flex items-center h-full bg-cyan-500">
          {/* Desktop input */}
          <div className="hidden lg:block lg:flex-1">
            <TextAreaForm
              textColor={TextColors.WHITE}
              fontWeight={FontWeights.BOLD}
              name="email"
              id="email"
              value={answerText}
              className={`w-full border-none rounded-none bg-transparent transition-all duration-0 placeholder:text-white/80 [field-sizing:content] ${answerText.length === 0 ? 'italic' : ''}`}
              placeholder={`Add answer ${answerIndex + 1}`}
              onChange={handleAnswerTextChange}
              disabled={isTheQuestionTrueOrFalse}
            />
          </div>

          {/* Mobile input */}
          <div
            className="flex-1 flex items-center lg:hidden bg-purple-500 py-6"
            onClick={handleMobileCardClick}
          >
            <TextAreaForm
              textColor={TextColors.WHITE}
              fontWeight={FontWeights.BOLD}
              name="email"
              id="email"
              value={answerText}
              className={`w-full h-full border-none rounded-none bg-transparent transition-all duration-0 placeholder:text-white/80 text-sm text-center [field-sizing:content] pointer-events-none ${answerText.length === 0 ? 'italic' : ''}`}
              placeholder={`Add answer ${answerIndex + 1}`}
              onChange={handleAnswerTextChange}
              disabled={isTheQuestionTrueOrFalse}
            />
          </div>
        </div>

        {/* Answer correctness button */}
        <div
          ref={correctnessButtonRef}
          className="absolute top-0 right-0 px-1 py-1 block xl:relative xl:top-auto xl:right-auto xl:px-0 xl:py-0 z-10"
        >
          {answerText.length > 0 && (
            <div
              className="min-w-5 min-h-5 md:min-w-6 md:min-h-6 xl:min-w-10 xl:min-h-10 border-2 md:border-[3px] xl:border-4 border-white rounded-full group cursor-pointer"
              onClick={(e) => handleAnwserCorrectnessChange(e, !answer.isCorrect)}
            >
              <div className={`min-w-5 min-h-5 md:min-w-6 md:min-h-6 xl:min-w-10 xl:min-h-10 rounded-full flex justify-center items-center ${answer.isCorrect ? 'bg-green-600' : 'bg-gray-400'}`}>
                <FontAwesomeIcon
                  icon={faCheck}
                  size={"lg"}
                  color={"white"}
                  className={`scale-75 md:scale-100 ${!answer.isCorrect ? 'opacity-0 group-hover:opacity-100' : ''}`}
                />
              </div>
            </div>
          )}
        </div>
      </KahootAnswerBackgroundColorWrapper>

      {/* Edit Answer Modal (Mobile only) */}
      <EditAnswerModal
        isOpen={isEditAnswerModalOpen}
        onClose={() => setIsEditAnswerModalOpen(false)}
        answerIndex={answerIndex}
      />
    </>
  )
}

export default KahootAnswerTextBox;
