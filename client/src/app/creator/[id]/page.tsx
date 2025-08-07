'use client'

import AutoSaveDraft from "@/app/components/utils/Creator/AutoSaveDraft";
import CreatorQuestionModifier from "@/app/components/utils/Creator/CreatorQuestionModifier";
import CreatorQuestionSettings from "@/app/components/utils/Creator/CreatorQuestionSettings";
import CreatorSliderOfQuestions from "@/app/components/utils/Creator/CreatorSliderOfQuestions";
import DisplayErrorMessage, { ResourceTypes } from "@/app/components/utils/ErrorHandlers/DisplayErrorMessage";
import CreatorNavbar from "@/app/components/utils/Navbars/CreatorNavbar";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditKahoot = () => {
  const { overwriteKahoot } = useKahootCreatorStore();
  const params = useParams();
  let { id } = params;
  const [kahootExists, setKahootExists] = useState<boolean>(false);
  const [isUserTheOwnerOfKahoot, setIsUserTheOwnerOfKahoot] = useState<boolean>(false);

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
      })
      .catch(err => {
        console.error(err);
      })
  }

  if (!kahootExists) {
    return (
      <DisplayErrorMessage resourceType={ResourceTypes.NOT_FOUND} />
    )
  }

  if (!isUserTheOwnerOfKahoot) {
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
