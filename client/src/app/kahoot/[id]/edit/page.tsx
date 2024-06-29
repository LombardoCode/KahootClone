'use client'

import Text from "@/app/components/UIComponents/Text";
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
    <div>
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.BLACK}
        useCase={UseCases.TITLE}
        className="text-4xl"
      >
        {kahoot.title}
      </Text>

      {kahoot.description !== null
        ? <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            className="text-2xl">
              {kahoot.description}
          </Text>
        : <Text
            fontWeight={FontWeights.REGULAR}
            textColor={TextColors.BLACK}
            useCase={UseCases.TITLE}
            textStyle={TextStyles.ITALIC}
            className="text-xl"
          >
            No description
          </Text>
      }
    </div>
  )
}

export default EditKahoot;
