import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faComments, faMedal } from "@fortawesome/free-solid-svg-icons";
import { ComboBox, ComboBoxOption, ComboBoxStateProps } from "../../UIComponents/ComboBox";
import { useState } from "react";

interface CreatorQuestionSettingsProps {
  className?: string;
}

const CreatorQuestionSettings = ({ className }: CreatorQuestionSettingsProps) => {
  const [questionType, setQuestionType] = useState<ComboBoxStateProps>({ textContent: "Quiz", valueContent: "Quiz" });
  const [timeLimit, setTimeLimit] = useState<ComboBoxStateProps>({ textContent: "10 seconds", valueContent: 10 });
  const [points, setPoints] = useState<ComboBoxStateProps>({ textContent: "Standard", valueContent: "Standard" });

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
          textContent={questionType.textContent}
          setTextContent={setQuestionType}
          className="w-full"
        >
          <ComboBoxOption
            textContent={"Quiz"}
            valueContent={"Quiz"}
            onClick={() => setQuestionType({ textContent: "Quiz", valueContent: "Quiz" })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"True or false"}
            valueContent={"True or false"}
            onClick={() => setQuestionType({ textContent: "True or false", valueContent: "True or false" })}
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
            valueContent={10}
            onClick={() => setTimeLimit({ textContent: "10 seconds", valueContent: 10 })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"20 seconds"}
            valueContent={20}
            onClick={() => setTimeLimit({ textContent: "20 seconds", valueContent: 20 })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"30 seconds"}
            valueContent={30}
            onClick={() => setTimeLimit({ textContent: "30 seconds", valueContent: 30 })}
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
            valueContent={"Standard"}
            onClick={() => setPoints({ textContent: "Standard", valueContent: "Standard" })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"Double points"}
            valueContent={"Double points"}
            onClick={() => setPoints({ textContent: "Double points", valueContent: "Double points" })}
          ></ComboBoxOption>
          <ComboBoxOption
            textContent={"No points"}
            valueContent={"No points"}
            onClick={() => setPoints({ textContent: "No points", valueContent: "No points" })}
          ></ComboBoxOption>
        </ComboBox>
      </div>
    </div>
  )
}

export default CreatorQuestionSettings;
