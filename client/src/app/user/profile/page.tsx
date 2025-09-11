"use client";

import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Label from "@/app/components/UIComponents/Label";
import Spinner from "@/app/components/UIComponents/Spinners/Spinner";
import Text from "@/app/components/UIComponents/Text";
import MediaSelector from "@/app/components/utils/Media/MediaSelector";
import ChangeUsernameModal from "@/app/components/utils/Modal/reusable/ChangeUsernameModal";
import ImageSelectorModal, { ExternalImagePurpose } from "@/app/components/utils/Modal/reusable/ImageSelectorModal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { UserMetadata } from "@/app/interfaces/Settings/EditProfile/UserMetadata.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useUserStore from "@/app/stores/useUserStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserSettingsProfileTab = () => {
  // Global state
  const { changeUserProfilePicture } = useUserStore();
  
  // Local component state
  const [userData, setUserData] = useState<UserMetadata>({
    userName: "",
    email: "",
    mediaUrl: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const getUserInformation = async () => {
    await axiosInstance.get('/user')
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
      .finally(() => {
        setIsLoading(false);
      })
  }

  const handleNewUserNameChangeForm = (newUserName: string) => {
    setUserData({
      ...userData,
      userName: newUserName
    })
  }

  // Media
  const [hasUserManuallyUpdateMediaUrl, setHasUserManuallyUpdateMediaUrl] = useState<boolean>(false);
  const [isMediaSelectorModalOpen, setIsMediaSelectorModalOpen] = useState<boolean>(false);

  const removeUserMediaUrl = () => {
    const mediaUrl = null;

    setUserData({
      ...userData,
      mediaUrl
    });

    changeUserProfilePicture(mediaUrl);

    setHasUserManuallyUpdateMediaUrl(true);
  }

  const updateUserMediaUrl = (mediaUrlSrc: string) => {
    setUserData({
      ...userData,
      mediaUrl: mediaUrlSrc
    });

    changeUserProfilePicture(mediaUrlSrc);

    setHasUserManuallyUpdateMediaUrl(true);
  }

  useEffect(() => {
    if (!hasUserManuallyUpdateMediaUrl) {
      return;
    }

    changeUserMediaUrl();
  }, [userData.mediaUrl]);

  const changeUserMediaUrl = async () => {
    await axiosInstance.post('/user/changeProfilePicture', {
      mediaUrl: userData.mediaUrl
    })
      .then(() => {})
      .catch(err => {
        console.error(err);
      })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mt-6">
        <Spinner className="text-kahoot-purple-variant-3" />
      </div>
    )
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
              <div id="user-information-content-image-content" className="flex flex-col items-center">
                <div className="w-full h-40">
                  <MediaSelector
                    doesItContainsAnImage={userData.mediaUrl !== null}
                    imageSrc={userData?.mediaUrl ?? ""}
                    removeImageActions={() => {
                      removeUserMediaUrl();
                    }}
                    clickedOnTheEmptyImage={(open) => {
                      setIsMediaSelectorModalOpen(open);
                    }}
                  />
                </div>
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
                      className="mr-3"
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

              <div id="information-fields-email" className="flex flex-col mb-10">
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

              <div id="information-fields-delete-account">
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.RED}
                  useCase={UseCases.BODY}
                  className="text-sm underline mb-2.5 cursor-pointer"
                >
                  <Link
                    href={ROUTES.ADMINISTRATION.ACCOUNT.DELETE_ACCOUNT}
                    className={`${TextColors.RED}`}
                  >
                    Delete account
                  </Link>
                </Text>

                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.BODY}
                  className="text-sm"
                >
                  If you delete your account, you'll lose access to all the kahoots you created.
                </Text>
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
      </div>

      {/* Media selector modal */}
      <ImageSelectorModal
        isOpen={isMediaSelectorModalOpen}
        onClose={() => setIsMediaSelectorModalOpen(false)}
        imagePurpose={ExternalImagePurpose.PROFILE_PICTURE}
        onImageSelect={(url: string) => {
          updateUserMediaUrl(url);
          setIsMediaSelectorModalOpen(false);
        }}
      />
    </>
  )
}

export default UserSettingsProfileTab;
