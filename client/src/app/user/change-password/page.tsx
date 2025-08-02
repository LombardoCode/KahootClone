"use client";

import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Label from "@/app/components/UIComponents/Label";
import Text from "@/app/components/UIComponents/Text";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface PasswordFieldState {
  value: string;
  visible: boolean;
};

interface PasswordFieldsState {
  oldPassword: PasswordFieldState;
  newPassword: PasswordFieldState;
  repeatNewPassword: PasswordFieldState;
}

const UserSettingsChangePasswordTab = () => {
  const [passwordFields, setPasswordFields] = useState<PasswordFieldsState>({
    oldPassword: { value: "", visible: false },
    newPassword: { value: "", visible: false },
    repeatNewPassword: { value: "", visible: false }
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleTextFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof PasswordFieldsState;

    setPasswordFields({
      ...passwordFields,
      [field]: {
        ...passwordFields[field],
        value: e.target.value
      }
    });

    if (passwordError !== null) {
      setPasswordError(null);
    }
  }

  const handlePasswordFieldCharsVisibility = (passwordField: keyof PasswordFieldsState) => {
    setPasswordFields({
      ...passwordFields,
      [passwordField]: {
        ...passwordFields[passwordField],
        visible: !passwordFields[passwordField].visible
      }
    })
  }

  const saveNewPassword = () => {
    axiosInstance.post('/user/changePassword', {
      oldPassword: passwordFields.oldPassword.value,
      newPassword: passwordFields.newPassword.value,
      repeatNewPassword: passwordFields.repeatNewPassword.value
    })
    .then(() => {})
    .catch(err => {
      console.error(err);
      setPasswordError(err.response.data);
    })
  }

  return (
    <>
      <div className="px-3 pt-5 w-[1000px] max-w-[90vw]">
        <div id="change-password-wrapper">
          <div id="change-password-header">
            <Text
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.GRAY}
              useCase={UseCases.BODY}
              className="text-sm"
            >
              Change password
            </Text>
          </div>
        </div>

        <div id="change-password-password-fields-wrapper" className="mt-6">
          <div id="old-password-content" className="mb-2">
            <Label
              fontWeight={FontWeights.BOLD}
              textColor={TextColors.BLACK}
              htmlFor="oldPassword"
              className="text-sm"
            >
              Old password
            </Label>

            <InputForm
              type={passwordFields.oldPassword.visible ? InputFormTypes.TEXT : InputFormTypes.PASSWORD}
              textColor={TextColors.BLACK}
              fontWeight={FontWeights.LIGHT}
              name="oldPassword"
              id="oldPassword"
              value={passwordFields.oldPassword.value}
              onChange={handleTextFormChange}
              className="text-md py-2"
              disabled={false}
              rightElement={
                <FontAwesomeIcon
                  icon={passwordFields.oldPassword.visible ? faEye : faEyeSlash}
                  onClick={() => handlePasswordFieldCharsVisibility("oldPassword")}
                  className={`${TextColors.LIGHT_GRAY} mr-1 px-3 py-3`}
                  size="1x"
                />
              }
            />
          </div>

          <div id="new-passwords-wrapper" className="grid grid-cols-12 gap-4 mb-1">
            <div id="new-password-content" className="col-span-6">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="newPassword"
                className="text-sm"
              >
                New password
              </Label>

              <InputForm
                type={passwordFields.newPassword.visible ? InputFormTypes.TEXT : InputFormTypes.PASSWORD}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="newPassword"
                id="newPassword"
                value={passwordFields.newPassword.value}
                onChange={handleTextFormChange}
                className="text-md py-2"
                disabled={false}
                rightElement={
                  <FontAwesomeIcon
                    icon={passwordFields.newPassword.visible ? faEye : faEyeSlash}
                    onClick={() => handlePasswordFieldCharsVisibility("newPassword")}
                    className={`${TextColors.LIGHT_GRAY} mr-1 px-3 py-3`}
                    size="1x"
                  />
                }
              />
            </div>

            <div id="repeat-new-password-content" className="col-span-6">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="repeatNewPassword"
                className="text-sm"
              >
                Repeat new password
              </Label>

              <InputForm
                type={passwordFields.repeatNewPassword.visible ? InputFormTypes.TEXT : InputFormTypes.PASSWORD}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="repeatNewPassword"
                id="repeatNewPassword"
                value={passwordFields.repeatNewPassword.value}
                onChange={handleTextFormChange}
                className="text-md py-2"
                disabled={false}
                rightElement={
                  <FontAwesomeIcon
                    icon={passwordFields.repeatNewPassword.visible ? faEye : faEyeSlash}
                    onClick={() => handlePasswordFieldCharsVisibility("repeatNewPassword")}
                    className={`${TextColors.LIGHT_GRAY} mr-1 px-3 py-3`}
                    size="1x"
                  />
                }
              />
            </div>
          </div>

          <div id="passwords-save-button" className="grid grid-cols-12">
            <Button
              backgroundColor={BackgroundColors.BLUE}
              size={ButtonSize.SMALL}
              perspective={PerspectiveSize.MEDIUM}
              textColor={TextColors.WHITE}
              fontWeight={FontWeights.BOLD}
              animateOnHover={false}
              onClick={() => saveNewPassword()}
              className="mr-3 w-full py-3 col-span-2"
            >
              Save
            </Button>
          </div>
        </div>

        {passwordError !== null && (
          <div id="password-errors">
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.RED}
              useCase={UseCases.BODY}
              className="text-sm"
            >
              {passwordError}
            </Text>
          </div>
        )}
      </div>
    </>
  )
}

export default UserSettingsChangePasswordTab;
