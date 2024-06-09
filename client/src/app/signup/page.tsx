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
import BackgroundShapes from "../components/utils/BackgroundShapes";
import MainContent from "../components/utils/MainContent";

const Signup = () => {
  const createAccount = (e: any) => {
    e.preventDefault();
    console.log("Creating an account.")
  }

  return (
    <>
      <Navbar />
      <BackgroundShapes className="-z-10"/>
      <Container>
        <MainContent className="pt-12">
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
                    Email
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