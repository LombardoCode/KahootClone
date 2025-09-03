"use client";

import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import Card from "@/app/components/UIComponents/Card";
import LoadingFullScreen from "@/app/components/UIComponents/Loading/LoadingFullScreen";
import Text from "@/app/components/UIComponents/Text";
import BulletPointErrorsDisplayer from "@/app/components/utils/ErrorHandlers/BulletPointErrorsDisplayer";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useUserStore from "@/app/stores/useUserStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteAccountPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [deletingAccountInProcess, setDeletingAccountInProcess] = useState<boolean>(false);

  // Global store state
  const { clearUser } = useUserStore();

  const initializeAccountDeletionProcess = async () => {
    setDeletingAccountInProcess(true);

    try {
      await axiosInstance.delete(`/auth/delete-account`)
        .then(() => {
          clearUser();
          router.push(ROUTES.ROOT);
        })
        .catch(err => {
          const errors: string[] = err.response.data.errors;
          setErrors(errors);
        })
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingAccountInProcess(false);
    }
  }

  return (
    <div className="w-full flex justify-center">
      {deletingAccountInProcess && (
        <LoadingFullScreen text={`Deleting account`} />
      )}
      
      <div className=" px-3 pt-5 w-[700px] max-w-[90vw]">
        <div id="heading" className="mb-4">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            useCase={UseCases.BODY}
            className="text-2xl mb-2 text-center"
          >
            Are you sure you'd like to delete your account?
          </Text>
        </div>

        <Card>
          <div id="profile-picture-and-username" className="flex items-center mb-3">
            <div id="profile-picture" className="w-8 h-8 bg-red-500 rounded-full mr-3">
              {/*  */}
            </div>

            <div id="username">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.GRAY}
                useCase={UseCases.BODY}
                className="text-md"
              >
                Username
              </Text>
            </div>
          </div>

          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.GRAY}
            useCase={UseCases.BODY}
            className="text-sm"
          >
            We're sorry to see you go. Deleting your account is permanent and cannot be undone. Once deleted, you will no longer be able to sign in, and you will lose access to all the kahoots you've created.
          </Text>

          <div id="buttons" className="flex justify-center">
            <Button
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.MEDIUM}
              textColor={TextColors.WHITE}
              className="mr-2"
              animateOnHover={false}
              onClick={() => router.replace(ROUTES.ADMINISTRATION.SETTINGS.PROFILE)}
            >
              Cancel
            </Button>

            <Button
              backgroundColor={BackgroundColors.RED}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.MEDIUM}
              textColor={TextColors.WHITE}
              className="mr-2"
              animateOnHover={false}
              onClick={() => initializeAccountDeletionProcess()}
            >
              Delete
            </Button>
          </div>

          <BulletPointErrorsDisplayer errors={errors} />
        </Card>
      </div>
    </div>
  )
}

export default DeleteAccountPage;
