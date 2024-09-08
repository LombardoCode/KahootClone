import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "../Logo";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import useKahootCreatorStore, { KahootQuestionValidation } from "@/app/stores/Kahoot/useKahootCreatorStore";
import axiosInstance from "@/app/utils/axiosConfig";
import Modal, { ModalTypes } from "../Modal/Modal";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import { useEffect, useState } from "react";
import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import { useRouter } from "next/navigation";
import { Question } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";


const CreatorNavbar = () => {
  const router = useRouter();

  // Global store
  const { kahoot, isKahootFormDirty, getKahootPlayabilityStatus, kahootValidationStatus, updateTitleAndDescription, selectQuestion } = useKahootCreatorStore();

  // Modals states
  const [isKahootHeaderModalOpen, setIsKahootHeaderModalOpen] = useState<boolean>(false);
  const [isKahootSavedModalOpen, setIsKahootSavedModalOpen] = useState<boolean>(false);

  // const [isKahootPlayable, setIsKahootPlayable] = useState<boolean>(false);
  const [kahootHeaderInfo, setKahootHeaderInfo] = useState<KahootHeaderInfo>({
    title: kahoot?.title || "",
    description: kahoot?.description || ""
  });

  const handleKahootHeaderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    axiosInstance.put('/kahootcreator/drafts', {
      id: kahoot?.id,
      title: kahoot?.title,
      description: kahoot?.description,
      createdAt: kahoot?.createdAt,
      updatedAt: kahoot?.updatedAt,
      questions: kahoot?.questions
    })
      .then(res => {
        getKahootPlayabilityStatus();
        setIsKahootSavedModalOpen(true);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const doesQuestionContainsAnError = (question: KahootQuestionValidation): boolean => {
    return question.errors.questionTitle !== ""
      || question.errors.missingAnswerTitles !== ""
      || question.errors.answerCorrectness !== "";
  }

  const createLobby = () => {
    axiosInstance.post('/lobby/create', { kahootId: kahoot?.id })
      .then(res => {
        const gamePIN: number = res.data.gamePIN;
        router.push(`/lobby/${gamePIN}`)
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <nav id="navigation-creator" className="flex justify-between items-center px-3">
        <div id="creator-page-logo-and-kahoots-title-and-description" className="flex items-center h-14">
          <div
            onClick={() => router.push(`/dashboard`)}
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
          {isKahootFormDirty && (
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              onClick={() => saveDraft()}
            >
              Save changes
            </Button>
          )}
        </div>
      </nav>

      {/* Modal to be displayed when user clicks on the title / description to modify the kahoot header information */}
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isKahootHeaderModalOpen}
        title={`Kahoot information`}
        onClose={() => setIsKahootHeaderModalOpen(false)}
        bodyContent={(
          <>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-base"
            >
              Rename your kahoot&apos;s s title and description
            </Text>
            <div className="flex flex-col">
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="title"
                id="title"
                placeholder="Your new title"
                className="mt-2"
                value={kahootHeaderInfo.title}
                onChange={handleKahootHeaderFormChange}
              />
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="description"
                id="description"
                placeholder="Your new description"
                className="mt-2"
                value={kahootHeaderInfo.description}
                onChange={handleKahootHeaderFormChange}
              />
            </div>
          </>
        )}
        footerContent={(
          <>
            <Button
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.WHITE}
              className="text-sm"
              size={ButtonSize.MEDIUM}
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
                onClick={() => createLobby()}
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
                  const kahootIndex = questionWithError.kahootIndex;
                  const isLastItem = index === array.length - 1;

                  return (
                    <div key={kahootIndex}>
                      <div id="question-info-header" className="flex">
                        <div id="question-image" className="w-20 mr-3 bg-gray-500 rounded-md"></div>
                        <div id="question-layout-and-title" className="flex-1 flex flex-col py-2">
                          <Text
                            fontWeight={FontWeights.REGULAR}
                            textColor={TextColors.BLACK}
                            useCase={UseCases.LONGTEXT}
                            className="text-sm"
                          >
                            {kahootIndex + 1} - {kahoot?.questions[kahootIndex].layout}
                          </Text>

                          {kahoot?.questions[kahootIndex].title && (
                            <Text
                              fontWeight={FontWeights.BOLD}
                              textColor={TextColors.BLACK}
                              useCase={UseCases.LONGTEXT}
                              className="text-sm"
                            >
                              {kahoot?.questions[kahootIndex].title}
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
                              selectQuestion(kahootIndex);
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
                  className="text-sm"
                  size={ButtonSize.MEDIUM}
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
                  onClick={() => {
                    router.push('/dashboard')
                  }}
                >
                  Done
                </Button>
              </>
            )}
          </>
        )}
        onClose={() => setIsKahootSavedModalOpen(false)}
      />
    </>
  )
}

export default CreatorNavbar;
