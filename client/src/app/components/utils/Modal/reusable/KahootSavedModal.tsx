import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import Modal, { ModalTypes } from "../Modal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { createLobby } from "@/app/utils/Lobby/lobbyUtils";
import Text from "@/app/components/UIComponents/Text";
import useKahootCreatorStore, { KahootQuestionValidation } from "@/app/stores/Kahoot/useKahootCreatorStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "@/app/utils/Routes/routesUtils";


interface KahootSavedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KahootSavedModal = ({ isOpen, onClose }: KahootSavedModalProps) => {
  // Global store
  const { kahoot, kahootValidationStatus, selectQuestion } = useKahootCreatorStore();

  // Local component state
  const router = useRouter();

  const doesQuestionContainsAnError = (question: KahootQuestionValidation): boolean => {
    return question.errors.questionTitle !== ""
      || question.errors.missingAnswerTitles !== ""
      || question.errors.answerCorrectness !== "";
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
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
              perspective={PerspectiveSize.MEDIUM}
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
                            onClose();
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
                perspective={PerspectiveSize.MEDIUM}
                animateOnHover={false}
                onClick={() => {
                  onClose();
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
                perspective={PerspectiveSize.MEDIUM}
                animateOnHover={false}
                onClick={() => router.push(ROUTES.MENU.LIBRARY)}
              >
                Go to library
              </Button>
            </>
          )}
        </>
      )}
      onClose={() => onClose()}
    />
  )
}

export default KahootSavedModal;
