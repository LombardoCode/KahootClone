import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerGridWrapper from "../Quizes/KahootAnswerGridWrapper";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Answer } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useEffect, useState } from "react";
import KahootAnswerTextBox from "../Quizes/KahootAnswerTextBox";
import Button, { ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { doesThisQuestionHasAnImage } from "@/app/utils/kahootUtils";
import ImageSelectorModal, { ExternalImagePurpose } from "../Modal/reusable/ImageSelectorModal";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  // Store
  const { kahoot, questionIndex, updateQuestionTitle, updateQuestionMediaUrl, removeQuestionMediaUrl } = useKahootCreatorStore();

  // Local component
  const [title, setTitle] = useState<string>(kahoot?.questions[questionIndex]?.title || "");
  const [isMediaSelectorModalOpen, setIsMediaSelectorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setTitle(kahoot?.questions[questionIndex]?.title || "");
  }, [kahoot, questionIndex]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateQuestionTitle(questionIndex, newTitle);
  }

  const handleImageClick = () => {
    setIsMediaSelectorModalOpen(true);
  }

  const deleteImageFromCurrentQuestion = () => {
    removeQuestionMediaUrl(questionIndex);
  }

  return (
    <>
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

          <div
            id="question-file-media"
            className="my-6 mx-auto w-96 bg-white/50 hover:bg-white/35 transition inset-0 backdrop-blur-md rounded-md"
          >
            <div className="relative">
              {doesThisQuestionHasAnImage(kahoot?.questions[questionIndex].mediaUrl ?? null)
                ? (
                  <div
                    id="question-media-preview-and-media-options-wrapper"
                    className="mx-auto w-96"
                  >
                    <div id="question-media-preview" className="pt-4 pb-1">
                      <img
                        src={`${kahoot?.questions[questionIndex].mediaUrl}`}
                        alt="Question media"
                        className="rounded-md shadow-md max-h-64 object-contain mx-auto"
                      />
                    </div>

                    <div id="media-options" className="flex justify-end px-3">
                      <Button
                        backgroundColor={BackgroundColors.WHITE}
                        animateOnHover={false}
                        perspective={PerspectiveSize.MEDIUM}
                        size={ButtonSize.SMALL}
                        className="shadow-md"
                        onClick={() => deleteImageFromCurrentQuestion()}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={`${TextColors.GRAY}`}
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    id="icon-plus-and-insert-media-caption-wrapper"
                    className="py-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
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
                )}
            </div>
          </div>

          <div id="answers">
            <KahootAnswerGridWrapper>
              {kahoot?.questions[questionIndex]?.answers.map((answer: Answer, index: number) => (
                <KahootAnswerTextBox
                  key={index}
                  answerIndex={index}
                  answer={answer}
                />
              ))}
            </KahootAnswerGridWrapper>
          </div>
        </div>
      </div>

      {/* Media selector modal */}
      <ImageSelectorModal
        isOpen={isMediaSelectorModalOpen}
        onClose={() => setIsMediaSelectorModalOpen(false)}
        imagePurpose={ExternalImagePurpose.QUESTION_IMAGE}
        onImageSelect={(url: string) => {
          updateQuestionMediaUrl(questionIndex, url);
          setIsMediaSelectorModalOpen(false);
        }}
      />
    </>
  )
}

export default CreatorQuestionModifier;
