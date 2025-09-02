"use client";

import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import Card from "@/app/components/UIComponents/Card";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Label from "@/app/components/UIComponents/Label";
import Text from "@/app/components/UIComponents/Text";
import BulletPointErrorsDisplayer from "@/app/components/utils/ErrorHandlers/BulletPointErrorsDisplayer";
import PasswordWasChangedSuccessfullyModal from "@/app/components/utils/Modal/reusable/PasswordWasChangedSuccessfullyModal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const email: string | null = searchParams.get("email");
  const token: string | null = searchParams.get("token");
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (email === null || token === null) {
      setIsValidToken(false);
      return;
    }

    const initializeTokenValidation = async () => {
      await validateToken();
    }

    initializeTokenValidation();
  }, []);

  const validateToken = async () => {
    await axiosInstance.post('/reset-password/validate', { token, email })
      .then(res => {
        const isValid: boolean = res.data.valid;
        setIsValidToken(isValid);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  if (isLoading) {
    return null;
  }

  if (!isValidToken) {
    return (
      <TokenIsNotValid />
    )
  }

  return (
    <TokenIsValid />
  )
}

const TokenIsNotValid = () => {
  const router = useRouter();

  return (
    <>
      <div className="bg-kahoot-red-300 px-3 py-3 rounded-md">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.BODY}
          className="text-md"
        >
          Token or payload data is not valid
        </Text>
      </div>

      <div className="flex justify-center mt-5">
        <Button
          backgroundColor={BackgroundColors.GREEN}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          className="text-lg"
          animateOnHover={false}
          size={ButtonSize.LARGE}
          onClick={() => router.push(ROUTES.ROOT)}
        >
          Go to homepage
        </Button>
      </div>
    </>
  )
}

const TokenIsValid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [formData, setFormData] = useState<any>({
    newPassword: '',
    newPasswordConfirm: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isPasswordChangedModalOpen, setIsPasswordChangedModalOpen] = useState<boolean>(false);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors !== null) {
      setErrors([]);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const changePassword = async (e: any) => {
    e.preventDefault();

    await axiosInstance.post('/reset-password/reset-password', {
      email,
      token,
      newPassword: formData.newPassword,
      newPasswordConfirm: formData.newPasswordConfirm
    })
      .then(() => {
        setIsPasswordChangedModalOpen(true);
      })
      .catch(err => {
        console.error(err);
        setErrors(err.response.data.errors);
      });
  }

  return (
    <>
      <Text
        textColor={TextColors.BLACK}
        className="text-2xl text-center mt-8"
        useCase={UseCases.TITLE}
        fontWeight={FontWeights.BOLD}
      >
        Change your password
      </Text>

      <div className="login-form w-96 mx-auto">
        <Card className="w-96 mx-auto mt-4">
          <form
            onSubmit={changePassword}
          >
            <div className="flex flex-col">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="newPassword"
              >
                New password
              </Label>
              <InputForm
                type={InputFormTypes.PASSWORD}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.BLACK}
                name="newPassword"
                id="newPassword"
                className="tracking-widest"
                value={formData.newPassword}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="newPasswordConfirm"
              >
                Confirm new password
              </Label>
              <InputForm
                type={InputFormTypes.PASSWORD}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.BLACK}
                name="newPasswordConfirm"
                id="newPasswordConfirm"
                className="tracking-widest"
                value={formData.newPasswordConfirm}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4">
              <Button
                backgroundColor={BackgroundColors.GREEN}
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                animateOnHover={false}
              >
                Change password
              </Button>
            </div>

            <BulletPointErrorsDisplayer errors={errors} />
          </form>
        </Card>
      </div>

      <PasswordWasChangedSuccessfullyModal
        isOpen={isPasswordChangedModalOpen}
        onClose={() => router.push(ROUTES.AUTH.LOGIN)}
      />
    </>
  )
}

export default ResetPasswordPage;
