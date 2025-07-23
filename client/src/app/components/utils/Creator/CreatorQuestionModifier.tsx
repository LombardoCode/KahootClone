import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerContainer from "../Quizes/KahootAnswerContainer";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Answer } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useEffect, useState } from "react";
import KahootAnswerTextBox from "../Quizes/KahootAnswerTextBox";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { doesThisQuestionHasAnImage } from "@/app/utils/kahootUtils";
import Modal, { ModalTypes } from "../Modal/Modal";
import usePexelsSearch from "@/app/hooks/usePexelsSearch";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  // Store
  const { kahoot, questionIndex, updateQuestionTitle, updateQuestionMediaUrl, removeMediaUrl } = useKahootCreatorStore();

  // Local component
  const [title, setTitle] = useState<string>(kahoot?.questions[questionIndex]?.title || "");
  const [isMediaSelectorModalOpen, setIsMediaSelectorModalOpen] = useState<boolean>(false);
  const [imageQueryText, setImageQueryText] = useState<string>("");
  const { results: pexelsResults, loading: pexelsLoading } = usePexelsSearch(imageQueryText, 1000, 30);

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
    removeMediaUrl(questionIndex);
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
              {doesThisQuestionHasAnImage(questionIndex)
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
                        perspective={false}
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
            <KahootAnswerContainer>
              {kahoot?.questions[questionIndex]?.answers.map((answer: Answer, index: number) => (
                <KahootAnswerTextBox
                  key={index}
                  answerIndex={index}
                  answer={answer}
                />
              ))}
            </KahootAnswerContainer>
          </div>
        </div>
      </div>

      {/* Media selector modal */}
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isMediaSelectorModalOpen}
        onClose={() => setIsMediaSelectorModalOpen(false)}
        className="w-[1000px] max-w-[90vw] min-h-[80vh]"
        bodyContent={(
          <>
            <div
              id="image-search-text-box"
              className="sticky top-0 z-10 bg-white pb-2 pt-4 px-4"
            >
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="image-query"
                id="image-query"
                value={imageQueryText}
                className="w-full py-3"
                placeholder="Search images (eg. tech, gaming, music...)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageQueryText(e.target.value)}
              />
            </div>
            <div
              id="popular-images-and-images-provided-by-pexels-wrapper"
              className="flex justify-between"
            >
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-sm"
              >
                Popular images
              </Text>
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-sm"
              >
                Images provided by Pexels
              </Text>
            </div>
            <div
              id="pexels-images"
              className="grid grid-cols-3 gap-3 mt-4 h-full overflow-y-auto px-10 py-6"
            >
              {pexelsLoading ? (
                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm col-span-3 text-center"
                >
                  Loading...
                </Text>
              ) : (
                pexelsResults.map((photo: any) => (
                  <div
                    key={photo.id}
                    className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
                    onClick={() => {
                      updateQuestionMediaUrl(questionIndex, photo.src.large);
                      setIsMediaSelectorModalOpen(false);
                    }}
                  >
                    <img
                      src={photo.src.medium}
                      alt={photo.alt || "pexels image"}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                ))
              )}
            </div>

          </>
        )}
        footerContent={(
          <Button
            backgroundColor={BackgroundColors.GRAY}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            animateOnHover={false}
            onClick={() => {
              setIsMediaSelectorModalOpen(false);
            }}
          >
            Cancel
          </Button>
        )}
      />
    </>
  )
}

export default CreatorQuestionModifier;
