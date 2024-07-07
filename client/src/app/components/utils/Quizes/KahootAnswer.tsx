import { KahootAnswerBackgroundColors } from "@/app/interfaces/Colors.interface";
import React from "react";
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, TextStyles, UseCases } from "@/app/interfaces/Text.interface";

interface KahootAnswerProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor: KahootAnswerBackgroundColors;
}

const KahootAnswer = ({ children = <></>, className, backgroundColor }: KahootAnswerProps) => {
  return (
    <div className={`px-3 py-10 rounded-md ${className} ${backgroundColor}`}>
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        textStyle={TextStyles.NORMAL}
      >
        {children}
      </Text>
    </div>
  )
}

export default KahootAnswer;
