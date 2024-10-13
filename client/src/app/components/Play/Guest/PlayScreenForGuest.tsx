import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Spinner from "../../UIComponents/Spinner";

const PlayScreenForGuest = () => {
  return (
    <div className="relative z-10 h-full flex justify-center items-center">
      <div id="get-ready" className="w-96 flex flex-col items-center">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-4xl mb-3"
        >
          Question 1
        </Text>

        <Spinner className="mb-3" />

        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.LONGTEXT}
          className="text-2xl"
        >
          Ready...
        </Text>
      </div>
    </div>
  )
}

export default PlayScreenForGuest;
