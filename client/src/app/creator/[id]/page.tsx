'use client'

import Text from "@/app/components/UIComponents/Text";
import CreatorQuestionModifier from "@/app/components/utils/Creator/CreatorQuestionModifier";
import CreatorQuestionSettings from "@/app/components/utils/Creator/CreatorQuestionSettings";
import CreatorSliderOfQuestions from "@/app/components/utils/Creator/CreatorSliderOfQuestions";
import CreatorNavbar from "@/app/components/utils/Navbars/CreatorNavbar";
import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditKahoot = () => {
  const params = useParams();
  let { id } = params;

  if (Array.isArray(id)) {
    id = id[0];
  }

  const [kahoot, setKahoot] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    if (id !== undefined) {
      getKahootInformation(id);
    }
  }, []);

  const getKahootInformation = (id: number | string) => {
    axiosInstance.get(`/kahoot/${id}`)
      .then(res => {
        setKahoot(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <div className="h-screen flex flex-col">
      <nav id="navigation-creator" className="flex items-center h-14">
        <CreatorNavbar />
        <div className="ml-4">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            className="text-xl"
          >
            {kahoot.title}
          </Text>

          <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            textStyle={kahoot.description ? TextStyles.NORMAL : TextStyles.ITALIC}
            className="text-base"
          >
            {kahoot.description ? kahoot.description : 'No description'}
          </Text>
        </div>
      </nav>

      <div id="creator-body" className="flex-1 flex">
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
