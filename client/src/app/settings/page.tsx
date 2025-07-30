import Text from "../components/UIComponents/Text"
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface"
import DashboardLayout from "../menu/layout"

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className="text-3xl"
      >
        Settings
      </Text>
    </DashboardLayout>
  )
}

export default SettingsPage;
