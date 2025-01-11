import { SpinnerSizes } from "../components/UIComponents/Spinners/Spinner.interface";
import SpinnerHalfDonut from "../components/UIComponents/Spinners/SpinnerHalfDonut/SpinnerHalfDonut";
import Text from "../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface";

const RankingPage = () => {
  return (
    <div className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative flex justify-center items-center z-10 h-full">
        <div
          id="current-question-indicator-panel"
          className="flex flex-col items-center"
        >
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.WHITE}
            useCase={UseCases.LONGTEXT}
            className="text-4xl mb-3 text-shadow shadow-black/60"
          >
            Drum roll...
          </Text>

          <div id="spinner-half-donut" className="relative mt-2">
            <SpinnerHalfDonut size={SpinnerSizes.EXTRA_SMALL} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingPage;
