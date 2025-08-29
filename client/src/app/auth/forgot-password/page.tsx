"use client";

import Button from "@/app/components/UIComponents/Button";
import Card from "@/app/components/UIComponents/Card";
import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Label from "@/app/components/UIComponents/Label";
import Text from "@/app/components/UIComponents/Text";
import Container from "@/app/components/utils/Container";
import MainContent from "@/app/components/utils/MainContent";
import Navbar from "@/app/components/utils/Navbar";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);

  return (
    <>
      <Navbar fixed={false} />
      <Container>
        <MainContent>
          {!emailWasSent
            ? (
              <EnterYourEmailForm setEmailWasSent={setEmailWasSent} />
            )
            : (
              <ResetLinkWasSentConfirmation />
            )}
        </MainContent>
      </Container>
    </>
  )
}

interface EnterYourEmailFormProps {
  setEmailWasSent: (value: boolean) => void;
}

const EnterYourEmailForm = ({ setEmailWasSent }: EnterYourEmailFormProps) => {
  const [formData, setFormData] = useState<any>({
    email: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const sendResetLink = (e: any) => {
    e.preventDefault();

    setEmailWasSent(true);
  }

  return (
    <>
      <Text
        textColor={TextColors.BLACK}
        className="text-2xl text-center mt-8"
        useCase={UseCases.TITLE}
        fontWeight={FontWeights.BOLD}
      >
        Reset your password
      </Text>

      <div className="login-form w-96 mx-auto">
        <Card className="w-96 mx-auto mt-4">
          <form
            onSubmit={sendResetLink}
          >
            <div className="flex flex-col">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="email"
              >
                Email
              </Label>
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="email"
                id="email"
                placeholder="Enter email address..."
                value={formData.email}
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
                Send reset link
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

const ResetLinkWasSentConfirmation = () => {
  const router = useRouter();

  return (
    <div className="login-form w-96 mx-auto">
      <Card className="w-96 mx-auto mt-4">
        <Text
          textColor={TextColors.BLACK}
          fontWeight={FontWeights.BOLD}
          useCase={UseCases.BODY}
          className="text-lg text-center mt-5"
        >
          Password reset link has been sent
        </Text>

        <Text
          textColor={TextColors.BLACK}
          fontWeight={FontWeights.REGULAR}
          useCase={UseCases.BODY}
          className="text-sm text-center mt-3"
        >
          An email with password reset link has been sent to your email address. If you do not see it in the inbox, check your spam folder.
        </Text>

        <div className="flex flex-col mt-4">
          <Button
            backgroundColor={BackgroundColors.GREEN}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            animateOnHover={false}
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            Back to log in
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage;
