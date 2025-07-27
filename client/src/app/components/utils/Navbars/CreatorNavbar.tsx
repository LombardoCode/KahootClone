import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "../Logo";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore, { KahootQuestionValidation } from "@/app/stores/Kahoot/useKahootCreatorStore";
import Modal, { ModalTypes } from "../Modal/Modal";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import { useEffect, useState } from "react";
import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faImage } from "@fortawesome/free-solid-svg-icons";
import { createLobby } from "@/app/utils/Lobby/lobbyUtils";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { saveKahootDraft } from "@/app/utils/KahootCreator/kahootCreatorUtils";
import TextAreaForm from "../../UIComponents/TextAreaForm";
import ImageSelectorModal from "../Modal/reusable/ImageSelectorModal";
import RadioButton, { RadioButtonSize } from "../../UIComponents/RadioButton";
import { KahootVisibilityOption } from "@/app/interfaces/Creator/KahootVisibilityOption.enum";

const CreatorNavbar = () => {
  const router = useRouter();

  // Global store
  const { kahoot, resetIsKahootFormDirty, getKahootPlayabilityStatus, kahootValidationStatus, updateTitleAndDescription, selectQuestion, updateKahootMediaUrl, removeKahootMediaUrl, updateKahootVisibilityOption } = useKahootCreatorStore();

  // Modals states
  // Modal: Kahoot Header Information
  const [isKahootHeaderModalOpen, setIsKahootHeaderModalOpen] = useState<boolean>(false);
  const [isKahootSavedModalOpen, setIsKahootSavedModalOpen] = useState<boolean>(false);
  const doesThisKahootHasAnImage: boolean = kahoot?.mediaUrl !== null;

  // Modal: ImageSelectorModal
  const [isMediaSelectorModalOpen, setIsMediaSelectorModalOpen] = useState<boolean>(false);

  // Local component state
  const [kahootHeaderInfo, setKahootHeaderInfo] = useState<KahootHeaderInfo>({
    title: kahoot?.title || "",
    description: kahoot?.description || ""
  });

  const [selectedVisibilityOption, setSelectedVisibilityOption] = useState<KahootVisibilityOption>(KahootVisibilityOption.PRIVATE);

  useEffect(() => {
    if (kahoot) {
      setKahootHeaderInfo({
        title: kahoot.title,
        description: kahoot.description
      });

      const kahootVisibilityOption = kahoot.isPublic
        ? KahootVisibilityOption.PUBLIC
        : KahootVisibilityOption.PRIVATE

      setSelectedVisibilityOption(kahootVisibilityOption);
    }
  }, [kahoot]);

  const handleKahootHeaderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKahootHeaderInfo({
      ...kahootHeaderInfo,
      [e.target.name]: e.target.value
    });
  }

  const saveDraft = () => {
    updateTitleAndDescription({
      title: kahootHeaderInfo?.title || kahoot?.title || "",
      description: kahootHeaderInfo?.description || kahoot?.description || ""
    });

    if (kahoot) {
      saveKahootDraft(kahoot, resetIsKahootFormDirty)
        .then(() => {
          getKahootPlayabilityStatus();
          setIsKahootSavedModalOpen(true);
        })
    }
  }

  const doesQuestionContainsAnError = (question: KahootQuestionValidation): boolean => {
    return question.errors.questionTitle !== ""
      || question.errors.missingAnswerTitles !== ""
      || question.errors.answerCorrectness !== "";
  }

  const changeVisibilityOptionHandler = (visibilityOption: KahootVisibilityOption) => {
    setSelectedVisibilityOption(visibilityOption);
    updateKahootVisibilityOption(visibilityOption);
  }

  return (
    <>
      <nav id="navigation-creator" className="flex justify-between items-center px-3">
        <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center h-14">
          <div
            onClick={() => router.push(ROUTES.MENU.DISCOVERY)}
            className="cursor-pointer"
          >
            <Logo
              size={LogoSize.REGULAR}
              color={LogoColors.VIOLET}
            />
          </div>
          <div
            className="ml-4 hover:bg-zinc-300 cursor-pointer px-2 py-3"
            onClick={() => setIsKahootHeaderModalOpen(true)}
          >
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              useCase={UseCases.TITLE}
              className="text-xl"
            >
              {kahoot?.title}
            </Text>

            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.TITLE}
              textStyle={kahootHeaderInfo.description ? TextStyles.NORMAL : TextStyles.ITALIC}
              className="text-base"
            >
              {kahoot?.description ? kahoot?.description : 'No description'}
            </Text>
          </div>
        </div>

        <div id="creator-page-save-changes-button">
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            size={ButtonSize.SMALL}
            animateOnHover={false}
            perspective={false}
            onClick={() => saveDraft()}
          >
            Save
          </Button>
        </div>
      </nav>

      {/* Modal to be displayed when user clicks on the title / description to modify the kahoot header information */}
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isKahootHeaderModalOpen}
        title={`Kahoot information`}
        onClose={() => setIsKahootHeaderModalOpen(false)}
        className="w-[1000px] max-w-[90vw] min-h-[80vh]"
        bodyContent={(
          <div
            id="modal-to-display-basic-information-about-kahoot"
            className="grid grid-cols-12 gap-10"
          >
            <div className="col-span-12 xl:col-span-7">
              <div id="basic-info-title" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Title
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Enter a title for your kahoot.
                </Text>

                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="title"
                  id="title"
                  placeholder="Your new title"
                  className="w-full py-2 mt-2"
                  value={kahootHeaderInfo.title}
                  onChange={handleKahootHeaderFormChange}
                />
              </div>

              <div id="basic-info-description" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Description
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Provide a short description for your kahoot to increase visibility.
                </Text>

                <TextAreaForm
                  rows={4}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="description"
                  id="description"
                  placeholder="Your new description"
                  className="w-full py-2 mt-2"
                  value={kahootHeaderInfo.description}
                  onChange={handleKahootHeaderFormChange}
                />
              </div>

              <div id="basic-info-cover-visibility" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Visibility
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Choose who can see this kahoot.
                </Text>

                <div id="basic-info-cover-visibility-radio-buttons">
                  <div
                    id="basic-info-cover-visibility-radio-buttons-private"
                    className="flex items-center mt-4 cursor-pointer"
                    onClick={() => changeVisibilityOptionHandler(KahootVisibilityOption.PRIVATE)}
                  >
                    <RadioButton
                      id="private"
                      name="kahoot-visibility"
                      size={RadioButtonSize.MEDIUM}
                      checked={selectedVisibilityOption === KahootVisibilityOption.PRIVATE}
                      className="mx-5"
                    />
                    <div>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Private
                      </Text>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Only visible to you
                      </Text>
                    </div>
                  </div>

                  <div
                    id="basic-info-cover-visibility-radio-buttons-public"
                    className="flex items-center mt-4 cursor-pointer"
                    onClick={() => changeVisibilityOptionHandler(KahootVisibilityOption.PUBLIC)}
                  >
                    <RadioButton
                      id="public"
                      name="kahoot-visibility"
                      size={RadioButtonSize.MEDIUM}
                      checked={selectedVisibilityOption === KahootVisibilityOption.PUBLIC}
                      className="mx-5"
                    />
                    <div>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.BLACK}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Public
                      </Text>
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm mb-1"
                      >
                        Visible to everyone on the Discover page.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-5">
              <div id="basic-info-cover-image" className="mb-4">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Cover image
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.BLACK}
                  useCase={UseCases.LONGTEXT}
                  className="text-sm mb-1"
                >
                  Add a cover image to make your kahoot stand out.
                </Text>

                <div
                  id="image-preview-wrapper"
                  className="mt-3"
                >
                  {doesThisKahootHasAnImage ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={kahoot?.mediaUrl ?? ""}
                        alt="Kahoot cover"
                        className="w-64 h-auto object-cover rounded-md"
                      />
                      <Button
                        backgroundColor={BackgroundColors.GRAY}
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.WHITE}
                        className="text-sm mr-2"
                        size={ButtonSize.MEDIUM}
                        perspective={false}
                        animateOnHover={false}
                        onClick={() => {
                          removeKahootMediaUrl();
                        }}
                      >
                        Remove image
                      </Button>
                    </div>
                  ) : (
                    <div
                      id="image-preview-content"
                      className="flex justify-center items-center w-40 h-24 rounded-md bg-slate-400/50 hover:bg-slate-400/80 cursor-pointer transition duration-300"
                      onClick={() => setIsMediaSelectorModalOpen(true)}
                    >
                      <FontAwesomeIcon
                        icon={faImage}
                        className={`${TextColors.GRAY}`}
                        size="2x"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        footerContent={(
          <>
            <Button
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm mr-2"
              size={ButtonSize.MEDIUM}
              perspective={false}
              animateOnHover={false}
              onClick={() => {
                setIsKahootHeaderModalOpen(false);
              }}
            >
              Close
            </Button>

            <Button
              backgroundColor={BackgroundColors.BLUE}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm"
              size={ButtonSize.MEDIUM}
              perspective={false}
              animateOnHover={false}
              onClick={() => {
                saveDraft();
                setIsKahootHeaderModalOpen(false);
              }}
            >
              Save
            </Button>
          </>
        )}
      />

      {/* Modal to be displayed after the user saves their Kahoot draft */}
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isKahootSavedModalOpen}
        title={
          kahootValidationStatus.isPlayable
            ? `Your kahoot is ready`
            : `This kahoot cannot be played`
        }
        bodyContent={(
          kahootValidationStatus.isPlayable
            ?
            <>
              <div>You can host it and play it</div>
              <Button
                backgroundColor={BackgroundColors.BLUE}
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                className="text-sm"
                size={ButtonSize.MEDIUM}
                perspective={false}
                animateOnHover={false}
                onClick={() => {
                  if (kahoot?.id) {
                    createLobby(kahoot.id, router)
                  }
                }}
              >
                Host
              </Button>
            </>
            :
            <>
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.BLACK}
                useCase={UseCases.LONGTEXT}
                className="text-base mb-4"
              >
                All questions need to be completed before you can start playing.
              </Text>

              {kahootValidationStatus.questions
                .filter((question) => doesQuestionContainsAnError(question))
                .map((questionWithError: KahootQuestionValidation, index: number, array) => {
                  const questionIndex = questionWithError.questionIndex;
                  const isLastItem = index === array.length - 1;

                  return (
                    <div key={questionIndex}>
                      <div id="question-info-header" className="flex">
                        <div id="question-image" className="w-20 mr-3 bg-gray-500 rounded-md"></div>
                        <div id="question-layout-and-title" className="flex-1 flex flex-col py-2">
                          <Text
                            fontWeight={FontWeights.REGULAR}
                            textColor={TextColors.BLACK}
                            useCase={UseCases.LONGTEXT}
                            className="text-sm"
                          >
                            {questionIndex + 1} - {kahoot?.questions[questionIndex].layout}
                          </Text>

                          {kahoot?.questions[questionIndex].title && (
                            <Text
                              fontWeight={FontWeights.BOLD}
                              textColor={TextColors.BLACK}
                              useCase={UseCases.LONGTEXT}
                              className="text-sm"
                            >
                              {kahoot?.questions[questionIndex].title}
                            </Text>
                          )}
                        </div>
                        <div id="question-fix-button">
                          <Button
                            backgroundColor={BackgroundColors.BLUE}
                            fontWeight={FontWeights.BOLD}
                            textColor={TextColors.WHITE}
                            className="text-sm"
                            size={ButtonSize.SMALL}
                            onClick={() => {
                              selectQuestion(questionIndex);
                              setIsKahootSavedModalOpen(false);
                            }}
                          >
                            Fix
                          </Button>
                        </div>
                      </div>

                      <div id="question-info-footer" className="mt-2">
                        {questionWithError.errors.questionTitle && (
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              color="#46178F"
                              className="mr-2"
                            />
                            <Text
                              fontWeight={FontWeights.BOLD}
                              textColor={TextColors.GRAY}
                              useCase={UseCases.LONGTEXT}
                              className="text-sm"
                            >
                              {questionWithError.errors.questionTitle}
                            </Text>
                          </div>
                        )}

                        {questionWithError.errors.missingAnswerTitles && (
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              color="#46178F"
                              className="mr-2"
                            />
                            <Text
                              fontWeight={FontWeights.BOLD}
                              textColor={TextColors.GRAY}
                              useCase={UseCases.LONGTEXT}
                              className="text-sm"
                            >
                              {questionWithError.errors.missingAnswerTitles}
                            </Text>
                          </div>
                        )}

                        {questionWithError.errors.answerCorrectness && (
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              color="#46178F"
                              className="mr-2"
                            />
                            <Text
                              fontWeight={FontWeights.BOLD}
                              textColor={TextColors.GRAY}
                              useCase={UseCases.LONGTEXT}
                              className="text-sm"
                            >
                              {questionWithError.errors.answerCorrectness}
                            </Text>
                          </div>
                        )}
                      </div>
                      {!isLastItem && (
                        <hr className="h-px my-4 border-0 bg-slate-400"></hr>
                      )}
                    </div>
                  );
                })}
            </>
        )}
        footerContent={(
          <>
            {kahootValidationStatus.isPlayable && (
              <>
                <Button
                  backgroundColor={BackgroundColors.GRAY}
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  className="text-sm mr-2"
                  size={ButtonSize.MEDIUM}
                  perspective={false}
                  animateOnHover={false}
                  onClick={() => {
                    setIsKahootSavedModalOpen(false);
                  }}
                >
                  Back to edit
                </Button>

                <Button
                  backgroundColor={BackgroundColors.BLUE}
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  className="text-sm"
                  size={ButtonSize.MEDIUM}
                  perspective={false}
                  animateOnHover={false}
                  onClick={() => router.push(ROUTES.MENU.LIBRARY)}
                >
                  Go to library
                </Button>
              </>
            )}
          </>
        )}
        onClose={() => setIsKahootSavedModalOpen(false)}
      />

      {/* Media selector modal */}
      <ImageSelectorModal
        isOpen={isMediaSelectorModalOpen}
        onClose={() => setIsMediaSelectorModalOpen(false)}
        onImageSelect={(url: string) => {
          updateKahootMediaUrl(url);
          setIsMediaSelectorModalOpen(false);
        }}
      />
    </>
  )
}

export default CreatorNavbar;
