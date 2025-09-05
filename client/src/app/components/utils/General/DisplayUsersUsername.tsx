import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";

interface DisplayUsersUsernameProps {
  username: string | null;
}

const DisplayUsersUsername = ({ username }: DisplayUsersUsernameProps) => {
  if (username === null) {
    return;
  }

  return (
    <div>
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.BLACK}
        useCase={UseCases.LONGTEXT}
      >
        {username}
      </Text>
    </div>
  )
}

export default DisplayUsersUsername;
