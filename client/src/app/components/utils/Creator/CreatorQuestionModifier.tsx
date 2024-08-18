import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import KahootAnswer from "../Quizes/KahootAnswer";
import KahootAnswerContainer from "../Quizes/KahootAnswerContainer";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Answer } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useEffect, useState } from "react";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  // Store
  const { kahoot, kahootIndex, updateQuestionTitle } = useKahootCreatorStore();

  // Local component
  const [title, setTitle] = useState<string>(kahoot?.questions[kahootIndex]?.title || "");

  useEffect(() => {
    setTitle(kahoot?.questions[kahootIndex]?.title || "");
  }, [kahoot, kahootIndex]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateQuestionTitle(kahootIndex, newTitle);
  }

  return (
    <div className={`relative px-6 py-8 ${className} bg-creator-classroom bg-center bg-cover bg-no-repeat`}>
      <div className="absolute inset-0 bg-black opacity-5"></div>
      
      <div className="relative z-10">
        <div id="question-title">
          <InputForm
            id={`question`}
            name={`question`}
            textColor={TextColors.GRAY}
            type={InputFormTypes.TEXT}
            fontWeight={FontWeights.BOLD}
            value={title}
            className="w-full text-center py-3"
            placeholder={`The question goes here`}
            onChange={handleTitleChange}
          />
        </div>

        <div id="question-file-media" className="relative my-6 mx-auto w-96 py-4">
          <div className="absolute bg-white/50 inset-0 backdrop-blur-md rounded-md"></div>
          <div className="relative">
            <div id="icon-plus" className="flex justify-center px-3 py-3">
              <FontAwesomeIcon
                icon={faPlus}
                className="bg-white px-3 py-3 shadow-md"
                fontSize="24"
              />
            </div>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.GRAY}
              useCase={UseCases.LONGTEXT}
              textStyle={TextStyles.NORMAL}
              className="text-xl text-center"
            >
              Find and insert media
            </Text>
          </div>
        </div>

        <div id="answers">
          <KahootAnswerContainer>
            {kahoot?.questions[kahootIndex]?.answers.map((answer: Answer, index: number) => (
              <KahootAnswer
                key={index}
                index={index}
                selectable={false}
              >
                {answer.text === ""
                  ? `Add answer ${index + 1}`
                  : answer.text
                }
              </KahootAnswer>
            ))}
          </KahootAnswerContainer>
        </div>
      </div>
    </div>
  )
}

export default CreatorQuestionModifier;
