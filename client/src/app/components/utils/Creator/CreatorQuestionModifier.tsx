import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCommentDots, faEllipsisVertical, faMedal, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerGridWrapper from "../Quizes/KahootAnswerGridWrapper";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Answer } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useEffect, useState } from "react";
import KahootAnswerTextBox from "../Quizes/KahootAnswerTextBox";
import Button, { ButtonSize, PerspectiveSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { doesThisQuestionHasAnImage } from "@/app/utils/kahootUtils";
import ImageSelectorModal, { ExternalImagePurpose } from "../Modal/reusable/ImageSelectorModal";
import TextAreaForm from "../../UIComponents/TextAreaForm";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import DeleteQuestionModal from "../Modal/reusable/DeleteQuestionModal";
import ChangeQuestionTypeModal from "../Modal/reusable/mobile/ChangeQuestionTypeModal";
import ChangeTimeLimitModal from "../Modal/reusable/mobile/ChangeTimeLimitModal";
import ChangePointsModal from "../Modal/reusable/mobile/ChangePointsModal";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  // Store
  const { kahoot, questionIndex, updateQuestionTitle, updateQuestionMediaUrl, removeQuestionMediaUrl } = useKahootCreatorStore();

  // Local component
  const [title, setTitle] = useState<string>(kahoot?.questions[questionIndex]?.title || "");
  const [isMediaSelectorModalOpen, setIsMediaSelectorModalOpen] = useState<boolean>(false);
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState<boolean>(false);
  const [isChangeQuestionTypeModalOpen, setIsChangeQuestionTypeModalOpen] = useState<boolean>(false);
  const [isChangeTimeLimitModalOpen, setIsChangeTimeLimitModalOpen] = useState<boolean>(false);
  const [isChangePointsModalOpen, setIsChangePointsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setTitle(kahoot?.questions[questionIndex]?.title || "");
  }, [kahoot, questionIndex]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleDeleteQuestionClick = () => {
    setIsDeleteQuestionModalOpen(true);
  }

  const handleChangeQuestionTypeClick = () => {
    setIsChangeQuestionTypeModalOpen(true);
  }

  const handleChangeTimeLimitClick = () => {
    setIsChangeTimeLimitModalOpen(true);
  }

  const handleChangePointsClick = () => {
    setIsChangePointsModalOpen(true);
  }

  return (
    <>
      <div className={`relative h-auto overflow-y-auto px-6 py-8 pb-32 xl:pb-8 bg-creator-classroom bg-center bg-cover bg-no-repeat ${className}`}>
        <div className="absolute inset-0 bg-black opacity-5"></div>

        <div className="relative z-10">
          <div id="question-title">
            {/* Desktop */}
            <InputForm
              id={`question-text-desktop`}
              name={`question`}
              textColor={TextColors.GRAY}
              type={InputFormTypes.TEXT}
              fontWeight={FontWeights.BOLD}
              value={title}
              className="hidden xl:block w-full text-md text-center py-3"
              placeholder={`The question goes here`}
              onChange={handleTitleChange}
            />

            {/* Mobile */}
            <div className="xl:hidden flex items-center gap-2">
              <TextAreaForm
                id={`question-text-mobile`}
                name={`question`}
                textColor={TextColors.GRAY}
                fontWeight={FontWeights.BOLD}
                value={title}
                className="flex-1 w-full text-xl text-center py-3 break-words whitespace-pre-wrap leading-normal min-h-[4rem] [field-sizing:content]"
                placeholder={`The question goes here`}
                onChange={handleTitleChange}
              />
              <Menu
                align="end"
                direction="bottom"
                menuButton={
                  <MenuButton className="cursor-pointer rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-md p-3 h-11 w-11 flex items-center justify-center transition">
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      size="lg"
                      className={TextColors.GRAY}
                    />
                  </MenuButton>
                }
              >
                <MenuItem
                  className="bg-white hover:bg-slate-300 cursor-pointer"
                  onClick={handleChangeQuestionTypeClick}
                >
                  <div className="flex items-center py-2">
                    <FontAwesomeIcon
                      icon={faCommentDots}
                      className="mr-2"
                    />

                    <Text
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-sm"
                    >
                      Change question type
                    </Text>
                  </div>
                </MenuItem>
                <MenuItem
                  className="bg-white hover:bg-slate-300 cursor-pointer"
                  onClick={handleChangeTimeLimitClick}
                >
                  <div className="flex items-center py-2">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="mr-2"
                    />

                    <Text
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-sm"
                    >
                      Set time limit
                    </Text>
                  </div>
                </MenuItem>
                <MenuItem
                  className="bg-white hover:bg-slate-300 cursor-pointer"
                  onClick={handleChangePointsClick}
                >
                  <div className="flex items-center py-2">
                    <FontAwesomeIcon
                      icon={faMedal}
                      className="mr-2"
                    />

                    <Text
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-sm"
                    >
                      Points
                    </Text>
                  </div>
                </MenuItem>
                <MenuItem
                  className="bg-white hover:bg-slate-300 cursor-pointer"
                  onClick={handleDeleteQuestionClick}
                >
                  <div className="flex items-center py-2">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="mr-2"
                    />

                    <Text
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-sm"
                    >
                      Delete question
                    </Text>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div
            id="question-file-media"
            className="my-4 lg:my-6 mx-auto w-full max-w-96 bg-white/50 hover:bg-white/35 transition inset-0 backdrop-blur-md rounded-md"
          >
            <div className="relative">
              {doesThisQuestionHasAnImage(kahoot?.questions[questionIndex].mediaUrl ?? null)
                ? (
                  <div
                    id="question-media-preview-and-media-options-wrapper"
                    className="mx-auto w-full max-w-96"
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
                    <div id="icon-plus" className="flex justify-center px-3 py-0 mb-2 xl:py-3">
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
                      className="text-lg xl:text-xl text-center"
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

      {/* Delete question modal */}
      {kahoot?.questions[questionIndex] && (
        <DeleteQuestionModal
          isOpen={isDeleteQuestionModalOpen}
          onClose={() => setIsDeleteQuestionModalOpen(false)}
          question={kahoot.questions[questionIndex]}
        />
      )}

      {/* Change question type modal */}
      <ChangeQuestionTypeModal
        isOpen={isChangeQuestionTypeModalOpen}
        onClose={() => setIsChangeQuestionTypeModalOpen(false)}
      />

      {/* Change time limit modal */}
      <ChangeTimeLimitModal
        isOpen={isChangeTimeLimitModalOpen}
        onClose={() => setIsChangeTimeLimitModalOpen(false)}
      />

      {/* Change points modal */}
      <ChangePointsModal
        isOpen={isChangePointsModalOpen}
        onClose={() => setIsChangePointsModalOpen(false)}
      />
    </>
  )
}

export default CreatorQuestionModifier;
