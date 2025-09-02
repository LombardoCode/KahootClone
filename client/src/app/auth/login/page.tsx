'use client'

import Link from "next/link";
import Button from "../../components/UIComponents/Button";
import InputForm, { InputFormTypes } from "../../components/UIComponents/InputForm";
import Label from "../../components/UIComponents/Label";
import Text from "../../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../../interfaces/Text.interface";
import Card from "../../components/UIComponents/Card";
import axiosInstance from "../../utils/axiosConfig";
import { useState } from "react";
import { AccountLoginInfo } from "../../interfaces/Auth/AccountLoginInfo";
import useUserStore from "../../stores/useUserStore";
import { useRouter } from "next/navigation";
import { BackgroundColors } from "../../interfaces/Colors.interface";
import { ROUTES } from "../../utils/Routes/routesUtils";
import BulletPointErrorsDisplayer from "@/app/components/utils/ErrorHandlers/BulletPointErrorsDisplayer";

const LoginPage = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState<AccountLoginInfo>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const logIn = async (e: any) => {
    e.preventDefault();

    await axiosInstance.post('/auth/login', formData)
      .then(res => {
        const user = res.data.user.userName;

        setUser(user);

        router.push(ROUTES.MENU.DISCOVERY);
      })
      .catch(err => {
        console.error(err);
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        }
      })
  }

  return (
    <>
      <Text
        textColor={TextColors.BLACK}
        className="text-2xl text-center mt-8"
        useCase={UseCases.TITLE}
        fontWeight={FontWeights.BOLD}
      >
        Log in
      </Text>

      <div className="login-form w-96 mx-auto">
        <Card className="w-96 mx-auto mt-4">
          <form
            onSubmit={logIn}
          >
            <div className="flex flex-col">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="email"
              >
                Username or email
              </Label>
              <InputForm
                type={InputFormTypes.TEXT}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.LIGHT}
                name="email"
                id="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col mt-4">
              <Label
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                htmlFor="password"
              >
                Password
              </Label>
              <InputForm
                type={InputFormTypes.PASSWORD}
                textColor={TextColors.BLACK}
                fontWeight={FontWeights.BLACK}
                name="password"
                id="password"
                className="tracking-widest"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>

            <div id="forgot-password-message">
              <Text
                textColor={TextColors.GRAY}
                fontWeight={FontWeights.REGULAR}
                useCase={UseCases.BODY}
                className="text-sm mt-4"
              >
                Forgot password? <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Reset your password</Link>
              </Text>
            </div>

            <div className="flex flex-col mt-4">
              <Button
                backgroundColor={BackgroundColors.GREEN}
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                animateOnHover={false}
              >
                Log in
              </Button>
            </div>

            <BulletPointErrorsDisplayer errors={errors} />
          </form>
        </Card>

        <Text
          fontWeight={FontWeights.LIGHT}
          textColor={TextColors.BLACK}
          useCase={UseCases.LONGTEXT}
          className={'mt-2 text-center'}
        >
          Don&apos;t have an account yet? <Link href={ROUTES.AUTH.SIGNUP}>Sign up</Link>
        </Text>
      </div>
    </>
  )
}

export default LoginPage;
