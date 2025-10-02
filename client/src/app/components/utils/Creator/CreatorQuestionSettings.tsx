import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComments, faMedal } from "@fortawesome/free-solid-svg-icons";
import { ComboBox, ComboBoxOption, ComboBoxStateProps } from "../../UIComponents/ComboBox";
import { useEffect, useState } from "react";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { PointsMultiplier, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { getTextContentForLayout, getTextContentForPoints } from "../Quizes/KahootQuestion.utills";
import CheckBox from "../../UIComponents/CheckBox";
import Label from "../../UIComponents/Label";

interface CreatorQuestionSettingsProps {
  className?: string;
}

const CreatorQuestionSettings = ({ className }: CreatorQuestionSettingsProps) => {
  // Global store
  const { kahoot, questionIndex, updateQuestionLayout, updateQuestionTimeLimit, updateQuestionPoints, updateQuestionHideTitle } = useKahootCreatorStore();

  // Local component
  const [questionLayout, setQuestionLayout] = useState<ComboBoxStateProps>({ textContent: "Classic", valueContent: QuizQuestionLayoutTypes.CLASSIC });
  const [timeLimit, setTimeLimit] = useState<ComboBoxStateProps>({ textContent: "10 seconds", valueContent: TimeLimits.TEN_S });
  const [points, setPoints] = useState<ComboBoxStateProps>({ textContent: "Standard", valueContent: PointsMultiplier.STANDARD });
  const [isHideQuestionTitle, setIsHideQuestionTitle] = useState<boolean>(false);

  // Update local state when questionIndex changes
  useEffect(() => {
    if (kahoot && kahoot.questions[questionIndex]) {
      const currentQuestion = kahoot.questions[questionIndex];
      setQuestionLayout({ textContent: getTextContentForLayout(currentQuestion.layout), valueContent: currentQuestion.layout })
      setTimeLimit({ textContent: `${currentQuestion.timeLimit} seconds`, valueContent: currentQuestion.timeLimit });
      setPoints({ textContent: getTextContentForPoints(currentQuestion.pointsMultiplier), valueContent: currentQuestion.pointsMultiplier });
      setIsHideQuestionTitle(currentQuestion.hideTitleUntilAnswer);
    }
  }, [kahoot, questionIndex]);

  const handleQuestionLayoutChange = (questionLayout: ComboBoxStateProps) => {
    setQuestionLayout(questionLayout);
    updateQuestionLayout(questionIndex, questionLayout.valueContent);
  }

  const handleQuestionTimeLimitChange = (questionTimeLimit: ComboBoxStateProps) => {
    setTimeLimit(questionLayout);
    updateQuestionTimeLimit(questionIndex, questionTimeLimit.valueContent);
  }

  const handleQuestionPointsChange = (questionPoints: ComboBoxStateProps) => {
    setPoints(questionPoints);
    updateQuestionPoints(questionIndex, questionPoints.valueContent);
  }

  const onHideQuestionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = e?.target.checked;
    setIsHideQuestionTitle(isChecked);
    updateQuestionHideTitle(questionIndex, isChecked);
  }

  return (
    <div className={`hidden xl:block px-4 py-3 ${className}`}>
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
          <ComboBoxOption
            textContent={"40 seconds"}
            valueContent={TimeLimits.FOURTY_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "40 seconds", valueContent: TimeLimits.FOURTY_S })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"50 seconds"}
            valueContent={TimeLimits.FIFTY_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "50 seconds", valueContent: TimeLimits.FIFTY_S })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"60 seconds"}
            valueContent={TimeLimits.SIXTY_S}
            onClick={() => handleQuestionTimeLimitChange({ textContent: "60 seconds", valueContent: TimeLimits.SIXTY_S })}
          ></ComboBoxOption>
        </ComboBox>
      </div>

      <div id="points" className="mb-8">
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

      <div
        id="hide-question-title-until-answer-wrapper"
        className="flex items-start"
      >
        <CheckBox
          id="hide-question"
          name="hide-question"
          className="mr-2"
          onChange={onHideQuestionHandler}
          checked={isHideQuestionTitle}
        />

        <Label
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.BLACK}
          htmlFor="hide-question"
          className="select-none text-md flex-1"
        >
          Hide question text until answering
        </Label>
      </div>
    </div>
  )
}

export default CreatorQuestionSettings;
