import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComments, faMedal } from "@fortawesome/free-solid-svg-icons";
import { ComboBox, ComboBoxOption, ComboBoxStateProps } from "../../UIComponents/ComboBox";
import { useEffect, useState } from "react";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { PointsMultiplier, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";

interface CreatorQuestionSettingsProps {
  className?: string;
}

const CreatorQuestionSettings = ({ className }: CreatorQuestionSettingsProps) => {
  // Global store
  const { kahoot, kahootIndex, updateQuestionLayout, updateQuestionTimeLimit, updateQuestionPoints } = useKahootCreatorStore();

  // Local component
  const [questionLayout, setQuestionLayout] = useState<ComboBoxStateProps>({ textContent: "Classic", valueContent: QuizQuestionLayoutTypes.CLASSIC });
  const [timeLimit, setTimeLimit] = useState<ComboBoxStateProps>({ textContent: "10 seconds", valueContent: TimeLimits.TEN_S });
  const [points, setPoints] = useState<ComboBoxStateProps>({ textContent: "Standard", valueContent: PointsMultiplier.STANDARD });

  // Update local state when kahootIndex changes
  useEffect(() => {
    if (kahoot && kahoot.questions[kahootIndex]) {
      const currentQuestion = kahoot.questions[kahootIndex];
      setQuestionLayout({ textContent: getTextContentForLayout(currentQuestion.layout), valueContent: currentQuestion.layout })
      setTimeLimit({ textContent: `${currentQuestion.timeLimit} seconds`, valueContent: currentQuestion.timeLimit });
      setPoints({ textContent: getTextContentForPoints(currentQuestion.pointsMultiplier), valueContent: currentQuestion.pointsMultiplier });
    }
  }, [kahoot, kahootIndex]);

  const getTextContentForLayout = (layout: QuizQuestionLayoutTypes): string => {
    switch (layout) {
      case QuizQuestionLayoutTypes.CLASSIC:
        return "Classic";
      case QuizQuestionLayoutTypes.TRUE_OR_FALSE:
        return "True or false";
      default:
        return "Classic";
    }
  }

  const getTextContentForPoints = (points: PointsMultiplier): string => {
    switch (points) {
      case 0:
        return "No points";
      case 1:
        return "Standard";
      case 2:
        return "Double points";
      default:
        return "Standard";
    }
  }

  const handleQuestionLayoutChange = (questionLayout: ComboBoxStateProps) => {
    setQuestionLayout(questionLayout);
    updateQuestionLayout(kahootIndex, questionLayout.valueContent);
  }

  const handleQuestionTimeLimitChange = (questionTimeLimit: ComboBoxStateProps) => {
    setTimeLimit(questionLayout);
    updateQuestionTimeLimit(kahootIndex, questionTimeLimit.valueContent);
  }

  const handleQuestionPointsChange = (questionPoints: ComboBoxStateProps) => {
    setPoints(questionPoints);
    updateQuestionPoints(kahootIndex, questionPoints.valueContent);
  }

  return (
    <div className={`px-4 py-3 ${className}`}>
      <div id="question-type" className="mb-8">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon
            icon={faComments}
            className="mr-2 text-slate-600"
          />
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-sm"
          >
            Question type
          </Text>
        </div>
        <ComboBox
          textColor={TextColors.BLACK}
          fontWeight={FontWeights.REGULAR}
          textContent={questionLayout.textContent}
          setTextContent={setQuestionLayout}
          className="w-full"
        >
          <ComboBoxOption
            textContent={"Classic"}
            valueContent={QuizQuestionLayoutTypes.CLASSIC}
            onClick={() => handleQuestionLayoutChange({ textContent: "Classic", valueContent: QuizQuestionLayoutTypes.CLASSIC })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"True or false"}
            valueContent={QuizQuestionLayoutTypes.TRUE_OR_FALSE}
            onClick={() => handleQuestionLayoutChange({ textContent: "True or false", valueContent: QuizQuestionLayoutTypes.TRUE_OR_FALSE })}
          ></ComboBoxOption>
        </ComboBox>
      </div>

      <div id="time-limit" className="mb-8">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon
            icon={faClock}
            className="mr-2 text-slate-600"
          />
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-sm"
          >
            Time limit
          </Text>
        </div>
        <ComboBox
          textColor={TextColors.BLACK}
          fontWeight={FontWeights.REGULAR}
          textContent={timeLimit.textContent}
          setTextContent={setTimeLimit}
          className="w-full"
        >
          <ComboBoxOption
            textContent={"10 seconds"}
            valueContent={TimeLimits.TEN_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "10 seconds", valueContent: TimeLimits.TEN_S })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"20 seconds"}
            valueContent={TimeLimits.TWENTY_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "20 seconds", valueContent: TimeLimits.TWENTY_S })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"30 seconds"}
            valueContent={TimeLimits.THIRTY_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "30 seconds", valueContent: TimeLimits.THIRTY_S })}
          ></ComboBoxOption>
        </ComboBox>
      </div>

      <div id="points">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon
            icon={faMedal}
            className="mr-2 text-slate-600"
          />
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
            textStyle={TextStyles.NORMAL}
            className="text-sm"
          >
            Points
          </Text>
        </div>
        <ComboBox
          textColor={TextColors.BLACK}
          fontWeight={FontWeights.REGULAR}
          textContent={points.textContent}
          setTextContent={setPoints}
          className="w-full"
        >
          <ComboBoxOption
            textContent={"Standard"}
            valueContent={PointsMultiplier.STANDARD}
            onClick={() => handleQuestionPointsChange({ textContent: "Standard", valueContent: PointsMultiplier.STANDARD })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"Double points"}
            valueContent={PointsMultiplier.DOUBLE_POINTS}
            onClick={() => handleQuestionPointsChange({ textContent: "Double points", valueContent: PointsMultiplier.DOUBLE_POINTS })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"No points"}
            valueContent={PointsMultiplier.NO_POINTS}
            onClick={() => handleQuestionPointsChange({ textContent: "No points", valueContent: PointsMultiplier.NO_POINTS })}
          ></ComboBoxOption>
        </ComboBox>
      </div>
    </div>
  )
}

export default CreatorQuestionSettings;
