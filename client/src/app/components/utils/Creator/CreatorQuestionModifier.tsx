import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import InputForm, { InputFormTypes } from "../../UIComponents/InputForm";
import Text from "../../UIComponents/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import KahootAnswerContainer from "../Quizes/KahootAnswerContainer";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import { Answer } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { useEffect, useRef, useState } from "react";
import KahootAnswerTextBox from "../Quizes/KahootAnswerTextBox";
import { debugLog } from "@/app/utils/debugLog";
import axiosInstance from "@/app/utils/axiosConfig";
import { saveKahootDraft } from "@/app/utils/KahootCreator/kahootCreatorUtils";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface CreatorQuestionModifierProps {
  className?: string;
}

const CreatorQuestionModifier = ({ className }: CreatorQuestionModifierProps) => {
  // Store
  const { kahoot, kahootIndex, updateQuestionTitle, updateQuestionMediaUrl, resetIsKahootFormDirty, removeMediaUrl } = useKahootCreatorStore();

  // Local component
  const [title, setTitle] = useState<string>(kahoot?.questions[kahootIndex]?.title || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(kahoot?.questions[kahootIndex]?.title || "");
  }, [kahoot, kahootIndex]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateQuestionTitle(kahootIndex, newTitle);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (kahoot) {
      const file: File | undefined = e.target.files?.[0];

      if (!file) {
        return;
      }

      debugLog("Image has been selected");

      const formData: FormData = new FormData();
      formData.append("file", file);

      try {
        await axiosInstance.post('/kahootcreator/upload-question-media', formData)
          .then(res => {
            const relativeUrl = res.data.relativeUrl;
            updateQuestionMediaUrl(kahootIndex, relativeUrl);

            debugLog(`Image has been uploaded successfully: ${res.data.relativeUrl}`)
            saveKahootDraft(kahoot, resetIsKahootFormDirty);
          })
      } catch (err) {
        console.error("There was an error");
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const doesThisQuestionHasAnImage = (): boolean => {
    const mediaUrl = kahoot?.questions[kahootIndex].mediaUrl;
    const doesThisQuestionHasAnImage: boolean = mediaUrl !== null && mediaUrl !== undefined && mediaUrl !== "";
    return doesThisQuestionHasAnImage;
  }

  const deleteImageFromCurrentQuestion = () => {
    removeMediaUrl(kahootIndex);
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

        <div
          id="question-file-media"
          className="my-6 mx-auto w-96 bg-white/50 hover:bg-white/35 transition inset-0 backdrop-blur-md rounded-md"
        >
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {doesThisQuestionHasAnImage()
              ? (
                <div
                  id="question-media-preview-and-media-options-wrapper"
                  className="mx-auto w-96"
                >
                  <div id="question-media-preview" className="pt-4 pb-1">
                    <img
                      src={`http://localhost:5000${kahoot?.questions[kahootIndex].mediaUrl}`}
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
            {kahoot?.questions[kahootIndex]?.answers.map((answer: Answer, index: number) => (
              <KahootAnswerTextBox key={index} index={index} />
            ))}
          </KahootAnswerContainer>
        </div>
      </div>
    </div>
  )
}

export default CreatorQuestionModifier;
