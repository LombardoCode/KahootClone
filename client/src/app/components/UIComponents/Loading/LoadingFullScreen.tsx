import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface"
import { SpinnerSizes } from "../Spinners/Spinner.interface"
import SpinnerHalfDonut from "../Spinners/SpinnerHalfDonut/SpinnerHalfDonut"
import Text from "../Text"

interface LoadingFullScreenProps {
  text: string;
}

const LoadingFullScreen = ({ text }: LoadingFullScreenProps) => {
  return (
    <div className="fixed top-0 left-0 flex flex-col items-center justify-center bg-black/80 w-full h-full z-30">
      <SpinnerHalfDonut
        size={SpinnerSizes.MEDIUM}
        className="mb-4"
      />

      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.WHITE}
        useCase={UseCases.LONGTEXT}
        className="text-2xl"
      >
        {text}
      </Text>
    </div>
  )
}

export default LoadingFullScreen;
