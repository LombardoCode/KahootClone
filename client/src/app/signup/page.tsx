'use client'

import Link from "next/link";
import Button from "../components/UIComponents/Button";
import InputForm, { InputFormTypes } from "../components/UIComponents/InputForm";
import Label from "../components/UIComponents/Label";
import Text from "../components/UIComponents/Text";
import Container from "../components/utils/Container";
import Navbar from "../components/utils/Navbar";
import { FontWeights, TextColors, TextStyles, UseCases } from "../interfaces/Text.interface";
import Card from "../components/UIComponents/Card";
import BackgroundShapes from "../components/utils/BackgroundShapes";
import MainContent from "../components/utils/MainContent";
import { useState } from "react";
import { CreateAccount } from "../interfaces/Auth/CreateAccount.interface";
import axiosInstance from "../utils/axiosConfig";
import { AccountRegistrationFormErrors } from "../interfaces/Auth/AccountRegistrationFormErrors";
import { AccountLoginInfo } from "../interfaces/Auth/AccountLoginInfo";
import { useRouter } from "next/navigation";
import { BackgroundColors } from "../interfaces/Colors.interface";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateAccount>({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<AccountRegistrationFormErrors>({
    email: [],
    username: [],
    password: []
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const createAccount = async (e: any) => {
    e.preventDefault();

    await axiosInstance.post('/auth/register', formData)
      .then(res => {
        console.log(res.data);
        logInUser();
      })
      .catch(err => {
        console.error(err);
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        }
      })
  }

  const logInUser = async () => {
    let loginData: AccountLoginInfo = {
      email: formData.username,
      password: formData.password
    };

    await axiosInstance.post('/auth/login', loginData)
      .then(res => {
        console.log(res.data);
        router.push('/dashboard');
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <Navbar />
      <BackgroundShapes className="-z-10"/>
      <Container>
        <MainContent>
          <Text
            textColor={TextColors.BLACK}
            className="text-4xl text-center mt-8"
            useCase={UseCases.TITLE}
            fontWeight={FontWeights.BOLD}
          >
            Create an account
          </Text>

          <div className="create-account-form w-96 mx-auto">
            <Text
              textColor={TextColors.BLACK}
              useCase={UseCases.HEADER}
              fontWeight={FontWeights.BOLD}
              className="text-center text-md mt-4"
            >
              Sign up with your email
            </Text>

            <Card className="w-96 mx-auto mt-4">
              <form
                onSubmit={createAccount}
              >
                <div className="flex flex-col">
                  <Label
                    fontWeight={FontWeights.BOLD}
                    textColor={TextColors.BLACK}
                    htmlFor="email"
                  >
                    Username
                  </Label>
                  <InputForm
                    type={InputFormTypes.TEXT}
                    textColor={TextColors.BLACK}
                    fontWeight={FontWeights.LIGHT}
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleFormChange}
                  />
                  {errors.username.length > 0 && (
                    <>
                      {errors.username.map((error: string, key: number) => (
                        <Text key={key} fontWeight={FontWeights.REGULAR} useCase={UseCases.LONGTEXT} textColor={TextColors.RED} textStyle={TextStyles.ITALIC} className="text-sm mt-1">{error}</Text>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex flex-col mt-4">
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
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                  {errors.email.length > 0 && (
                    <>
                      {errors.email.map((error: string, key: number) => (
                        <Text key={key} fontWeight={FontWeights.REGULAR} useCase={UseCases.LONGTEXT} textColor={TextColors.RED} textStyle={TextStyles.ITALIC} className="text-sm mt-1">{error}</Text>
                      ))}
                    </>
                  )}
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
                  {errors.password.length > 0 && (
                    <>
                      {errors.password.map((error: string, key: number) => (
                        <Text key={key} fontWeight={FontWeights.REGULAR} useCase={UseCases.LONGTEXT} textColor={TextColors.RED} textStyle={TextStyles.ITALIC} className="text-sm mt-1">{error}</Text>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex flex-col mt-4">
                  <Button
                    backgroundColor={BackgroundColors.GREEN}
                    textContent="Sign up"
                    fontWeight={FontWeights.BOLD}
                  />
                </div>
              </form>
            </Card>

            <Text
              fontWeight={FontWeights.LIGHT}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className={'mt-2 text-center'}
            >
              Already have an account? <Link href="/login">Log in</Link>
            </Text>
          </div>
        </MainContent>
      </Container>
    </>
  )
}

export default Signup;
