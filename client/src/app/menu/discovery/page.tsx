'use client';

import Text from "../../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../../interfaces/Text.interface";

const DiscoveryMenuPage = () => {
  return (
    <>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className="text-3xl"
      >
        Discovery
      </Text>
    </>
  )
}

export default DiscoveryMenuPage;
