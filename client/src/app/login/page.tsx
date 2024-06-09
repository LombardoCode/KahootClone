'use client'

import Link from "next/link";
import Button, { BackgroundColors } from "../components/UIComponents/Button";
import InputForm, { InputFormTypes } from "../components/UIComponents/InputForm";
import Label from "../components/UIComponents/Label";
import Text from "../components/UIComponents/Text";
import Container from "../components/utils/Container";
import Navbar from "../components/utils/Navbar";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";
import Card from "../components/UIComponents/Card";
import MainContent from "../components/utils/MainContent";

const LoginPage = () => {
  const logIn = (e: any) => {
    e.preventDefault();
    console.log("Log-in with the user's account.")
  }

  return (
    <>
      <Navbar />
      <Container>
        <MainContent>

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
                  />
                </div>

                <div className="flex flex-col mt-4">
                  <Button
                    backgroundColor={BackgroundColors.GREEN}
                    textContent="Log in"
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
              Don&apos;t have an account yet? <Link href="/signup">Sign up</Link>
            </Text>
          </div>
        </MainContent>
      </Container>
    </>
  )
}

export default LoginPage;
