"use client";

import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Label from "@/app/components/UIComponents/Label";
import Text from "@/app/components/UIComponents/Text";
import Logo, { LogoSize } from "@/app/components/utils/Logo";
import ChangeUsernameModal from "@/app/components/utils/Modal/reusable/ChangeUsernameModal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { UserMetadata } from "@/app/interfaces/Settings/EditProfile/UserMetadata.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useUserStore from "@/app/stores/useUserStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const UserSettingsProfileTab = () => {
  // Store state
  const { user } = useUserStore();

  // Local component state
  const [userData, setUserData] = useState<UserMetadata>({
    userName: "",
    email: "",
    mediaUrl: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  // Change username modal state
  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getUserInformation();
  }, []);

  const getUserInformation = () => {
    axiosInstance.get('/user')
      .then(res => {
        const userName: string = res.data.userName;
        const email: string = res.data.email;
        const mediaUrl: string = res.data.mediaUrl;

        setUserData({
          userName,
          email,
          mediaUrl
        });
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleNewUserNameChangeForm = (newUserName: string) => {
    setUserData({
      ...userData,
      userName: newUserName
    })
  }

  return (
    <>
      <div className="px-3 pt-5 w-[1000px] max-w-[90vw]">
        <div id="user-information-wrapper">
          <div id="user-information-header">
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.BODY}
              className="text-sm"
            >
              User information
            </Text>
          </div>

          <div id="user-information-content" className="grid grid-cols-12 gap-6 mt-6">
            <div id="user-information-content-image-wrapper" className="col-span-3">
              <div className="w-full h-40">
                {userData.mediaUrl
                  ? (
                    <img
                      src={`${userData.mediaUrl}`}
                      alt="w-full h-full"
                    />
                  )
                  : (
                    <div className="flex justify-center items-center h-full bg-kahoot-purple-variant-4">
                      <Logo
                        size={LogoSize.REGULAR}
                      />
                    </div>
                  )}
              </div>
            </div>

            <div id="user-information-content-information-fields-wrapper" className="col-span-9">
              <div id="information-fields-username" className="flex flex-col mb-5">
                <Label
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  htmlFor="username"
                  className="text-sm mb-1"
                >
                  Username
                </Label>
                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="userName"
                  id="userName"
                  value={userData.userName}
                  onChange={handleFormChange}
                  className="text-md py-2"
                  disabled={true}
                  rightElement={
                    <Button
                      backgroundColor={BackgroundColors.WHITE}
                      size={ButtonSize.EXTRA_SMALL}
                      perspective={PerspectiveSize.SMALL}
                      animateOnHover={false}
                      onClick={() => setIsChangeUsernameModalOpen(true)}
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        className={`${TextColors.LIGHT_GRAY}`}
                        size="sm"
                      />
                    </Button>
                  }
                />
              </div>

              <div id="information-fields-email" className="flex flex-col">
                <Label
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  htmlFor="email"
                  className="text-sm mb-1"
                >
                  Email
                </Label>
                <InputForm
                  type={InputFormTypes.TEXT}
                  textColor={TextColors.BLACK}
                  fontWeight={FontWeights.LIGHT}
                  name="email"
                  id="email"
                  value={userData.email}
                  onChange={handleFormChange}
                  className="text-md py-2 opacity-45"
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangeUsernameModal
        isOpen={isChangeUsernameModalOpen}
        onClose={() => setIsChangeUsernameModalOpen(false)}
        userName={userData.userName}
        setNewUserName={(newUserName: string) => handleNewUserNameChangeForm(newUserName)}
      />
    </>
  )
}

export default UserSettingsProfileTab;
