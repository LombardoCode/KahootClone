'use client';

import Text from "@/app/components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";

const DashboardSettingsPage = () => {
  return (
    <>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className="text-3xl"
      >
        Settings
      </Text>
    </>
  )
}

export default DashboardSettingsPage;
