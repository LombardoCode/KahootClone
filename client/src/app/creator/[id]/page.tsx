'use client'

import Spinner from "@/app/components/UIComponents/Spinners/Spinner";
import Text from "@/app/components/UIComponents/Text";
import AutoSaveDraft from "@/app/components/utils/Creator/AutoSaveDraft";
import CreatorQuestionModifier from "@/app/components/utils/Creator/CreatorQuestionModifier";
import CreatorQuestionSettings from "@/app/components/utils/Creator/CreatorQuestionSettings";
import CreatorSliderOfQuestions from "@/app/components/utils/Creator/CreatorSliderOfQuestions";
import DisplayErrorMessage, { ResourceTypes } from "@/app/components/utils/ErrorHandlers/DisplayErrorMessage";
import CreatorNavbar from "@/app/components/utils/Navbars/CreatorNavbar";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditKahoot = () => {
  const { overwriteKahoot } = useKahootCreatorStore();
  const params = useParams();
  let { id } = params;
  const [kahootExists, setKahootExists] = useState<boolean | null>(null);
  const [isUserTheOwnerOfKahoot, setIsUserTheOwnerOfKahoot] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (Array.isArray(id)) {
    id = id[0];
  }

  useEffect(() => {
    if (id !== undefined) {
      verifyIfKahootExists(id);
    }
  }, []);

  const verifyIfKahootExists = async (id: string) => {
    await axiosInstance.get(`/kahoot/kahootExists/${id}`)
      .then(() => {
        setKahootExists(true);
        verifyKahootOwnership();
      })
      .catch(err => {
        console.error(err);
      })
  }

  const verifyKahootOwnership = async () => {
    await axiosInstance.get(`/kahoot/VerifyOwnership/${id}`)
      .then(() => {
        setIsUserTheOwnerOfKahoot(true);
        getKahootInformation(id);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getKahootInformation = async (id: string) => {
    await axiosInstance.get(`/kahoot/${id}`)
      .then(res => {
        overwriteKahoot(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      })
  }

  if (loading) {
    return (
      <div className="absolute w-full h-full bg-white flex justify-center items-center">
        <div className="flex justify-center items-center">
          <Spinner className="text-kahoot-purple-variant-3 mr-2" />

          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            useCase={UseCases.BODY}
            className="text-3xl"
          >
            Loading
          </Text>
        </div>
      </div>
    )
  }

  if (kahootExists === false) {
    return (
      <DisplayErrorMessage resourceType={ResourceTypes.NOT_FOUND} />
    )
  }

  if (kahootExists === true && isUserTheOwnerOfKahoot === false) {
    return (
      <DisplayErrorMessage resourceType={ResourceTypes.FORBIDDEN} />
    )
  }

  return (
    <>
      <AutoSaveDraft />
      <div className="h-screen flex flex-col">
        <CreatorNavbar />

        <div id="creator-body" className="flex-1 flex overflow-hidden">
          <CreatorSliderOfQuestions
            className="w-48 bg-white"
          />
          <CreatorQuestionModifier
            className="flex-1 bg-slate-300"
          />
          <CreatorQuestionSettings
            className="w-72 bg-white"
          />
        </div>
      </div>
    </>
  )
}

export default EditKahoot;
