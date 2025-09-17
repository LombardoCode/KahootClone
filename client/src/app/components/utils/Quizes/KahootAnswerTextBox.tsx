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
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerBackgroundColorWrapper from "./KahootAnswerBackgroundColorWrapper";
import { Answer, QuizQuestionLayoutTypes } from "@/app/interfaces/Kahoot/Kahoot.interface";
import IconForKahootAnswer from "./IconForKahootAnswer";

interface KahootAnswerTextboxProps {
  className?: string;
  answerIndex: number;
  answer: Answer;
}

const KahootAnswerTextBox = ({ className, answerIndex, answer }: KahootAnswerTextboxProps) => {
  // Store
  const { kahoot, questionIndex, updateAnswerText, updateAnswerCorrectness } = useKahootCreatorStore();

  // Local component
  const answerText = kahoot?.questions[questionIndex].answers[answerIndex].text || "";
  const isTheQuestionTrueOrFalse: boolean = kahoot?.questions[questionIndex].layout === QuizQuestionLayoutTypes.TRUE_OR_FALSE;

  const handleAnswerTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value;
    updateAnswerText(questionIndex, answerIndex, newAnswer);
  }

  const handleAnwserCorrectnessChange = (isCorrect: boolean) => {
    updateAnswerCorrectness(questionIndex, answerIndex, isCorrect);
  }

  return (
    <>
      <KahootAnswerBackgroundColorWrapper
        colorIndex={answerIndex}
        className={`flex items-center ${className}`}
      >
        <IconForKahootAnswer
          index={answerIndex}
          size={48}
          className="py-10 mr-2"
        />

        <div className="flex-1 flex items-center">
          <InputForm
            type={InputFormTypes.TEXT}
            textColor={TextColors.WHITE}
            fontWeight={FontWeights.BOLD}
            name="email"
            id="email"
            value={answerText}
            className={`flex-1 h-24 border-none rounded-none bg-transparent transition-all duration-0 placeholder:text-white/80 ${answerText.length === 0 ? 'italic' : ''}`}
            placeholder={`Add answer ${answerIndex + 1}`}
            onChange={handleAnswerTextChange}
            disabled={isTheQuestionTrueOrFalse}
          />

          <div>
            {answerText.length > 0 && (
              <div
                className="min-w-12 min-h-12 border-4 border-white rounded-full group cursor-pointer"
                onClick={() => handleAnwserCorrectnessChange(!answer.isCorrect)}
              >
                <div className={`min-w-12 min-h-12 rounded-full flex justify-center items-center ${answer.isCorrect ? 'bg-green-600' : 'bg-gray-400'}`}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={"lg"}
                    color={"white"}
                    className={`${!answer.isCorrect ? 'opacity-0 group-hover:opacity-100' : ''}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </KahootAnswerBackgroundColorWrapper>
    </>
  )
}

export default KahootAnswerTextBox;
