import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface DisplayErrorMessageProps {
  resourceType: ResourceTypes;
};

export enum ResourceTypes {
  NOT_FOUND,
  FORBIDDEN
};

const DisplayErrorMessage = ({ resourceType }: DisplayErrorMessageProps) => {
  const router = useRouter();

  const displayIcon = (): JSX.Element => {
    switch (resourceType) {
      case ResourceTypes.NOT_FOUND:
        return (
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="10x"
            className={`${TextColors.GRAY} mb-5`}
          />
        );
      case ResourceTypes.FORBIDDEN:
        return (
          <FontAwesomeIcon
            icon={faBan}
            size="10x"
            className={`${TextColors.GRAY} mb-5`}
          />
        )
      default:
        return <></>
    }
  }

  const displayLabel = (): string => {
    switch (resourceType) {
      case ResourceTypes.NOT_FOUND:
        return `Sorry, the resource was not found.`;
      case ResourceTypes.FORBIDDEN:
        return `Sorry, this resource is forbidden.`;
      default:
        return `Something wrong happened.`;
    }
  }

  return (
    <>
      <div className="text-center mt-12">
        <div id="display-error-message-icon" className="mb-6">
          {displayIcon()}
        </div>

        <div id="display-error-message-label" className="mb-5">
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.GRAY}
            useCase={UseCases.BODY}
            className="text-2xl"
          >
            {displayLabel()}
          </Text>
        </div>

        <Button
          backgroundColor={BackgroundColors.BLUE}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          size={ButtonSize.LARGE}
          animateOnHover={false}
          onClick={() => router.push(ROUTES.MENU.DISCOVER)}
          className="text-xl"
        >
          Go back to homepage
        </Button>
      </div>
    </>
  )
};

export default DisplayErrorMessage;
