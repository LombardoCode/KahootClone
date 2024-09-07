'use client'

import CreatorQuestionModifier from "@/app/components/utils/Creator/CreatorQuestionModifier";
import CreatorQuestionSettings from "@/app/components/utils/Creator/CreatorQuestionSettings";
import CreatorSliderOfQuestions from "@/app/components/utils/Creator/CreatorSliderOfQuestions";
import CreatorNavbar from "@/app/components/utils/Navbars/CreatorNavbar";
import useKahootCreatorStore from "@/app/stores/Kahoot/useKahootCreatorStore";
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditKahoot = () => {
  const { overwriteKahoot } = useKahootCreatorStore();
  const params = useParams();
  let { id } = params;

  if (Array.isArray(id)) {
    id = id[0];
  }

  useEffect(() => {
    if (id !== undefined) {
      verifyIfKahootExists(id);
    }
  }, []);

  const verifyIfKahootExists = (id: string) => {
    axiosInstance.get(`/kahoot/kahootExists/${id}`)
      .then(res => {
        let kahootExists: boolean = res.data;

        if (kahootExists) {
          getKahootInformation(id);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getKahootInformation = (id: string) => {
    axiosInstance.get(`/kahoot/${id}`)
      .then(res => {
        overwriteKahoot(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
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
  )
}

export default EditKahoot;
