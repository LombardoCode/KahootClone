import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import Modal, { ModalTypes } from "../Modal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "@/app/components/UIComponents/Text";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosConfig";
import useUserStore from "@/app/stores/useUserStore";

interface ChangeUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setNewUserName?: (newUserName: string) => void;
}

const ChangeUsernameModal = ({ isOpen, onClose, userName, setNewUserName }: ChangeUsernameModalProps) => {
  // Store states
  const { setUser } = useUserStore();

  // Local component states
  const [userNameForm, setUserNameForm] = useState<string>(userName);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }

    setUserNameForm(e.target.value);
  }

  useEffect(() => {
    if (userName) {
      setUserNameForm(userName);
    }
  }, [userName, isOpen])

  const tryAndChangeUsersUserName = () => {
    axiosInstance.post('/user/changeUserName', {
      userName: userNameForm
    })
      .then(res => {
        const user = res.data.user.userName;

        setUser(user);

        if (setNewUserName) {
          setNewUserName(userNameForm);
        }

        onClose();
      })
      .catch(err => {
        console.error(err);
        const error: string = err.response.data;
        setError(error);
      })
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      onClose={() => {
        setError(null);
        onClose();
      }}
      className="w-[800px] max-w-[90vw]"
      bodyContent={(
        <>
          <div id="change-username-modal-header">
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.BODY}
              className="text-xl mb-3"
            >
              Change username
            </Text>
          </div>

          <div id="change-username-modal-body">
            <InputForm
              type={InputFormTypes.TEXT}
              textColor={TextColors.BLACK}
              fontWeight={FontWeights.LIGHT}
              name="userName"
              id="userName"
              value={userNameForm}
              onChange={handleUsernameChange}
              className="text-md py-2"
            />
          </div>

          {error && (
            <div id="error" className="py-1">
              <Text
                fontWeight={FontWeights.REGULAR}
                textColor={TextColors.RED}
                useCase={UseCases.BODY}
                className="text-sm"
              >
                {error}
              </Text>
            </div>
          )}
        </>
      )}
      footerContent={(
        <>
          <Button
            backgroundColor={BackgroundColors.GRAY}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            animateOnHover={false}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            backgroundColor={BackgroundColors.BLUE}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.MEDIUM}
            textColor={TextColors.WHITE}
            className="mr-2"
            animateOnHover={false}
            onClick={tryAndChangeUsersUserName}
          >
            Change
          </Button>
        </>
      )}
    />
  )
}

export default ChangeUsernameModal;
