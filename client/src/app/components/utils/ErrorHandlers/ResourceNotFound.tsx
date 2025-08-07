import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";
import Button, { ButtonSize } from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface ResourceNotFoundProps {
  resourceType: ResourceTypes;
};

export enum ResourceTypes {
  CATEGORY
};

const ResourceNotFound = ({ resourceType }: ResourceNotFoundProps) => {
  let errorMessage: string = "";
  const router = useRouter();

  switch (resourceType) {
    case ResourceTypes.CATEGORY:
      errorMessage = "The category you are trying to access doesn't exist."
      break;
  }

  return (
    <>
      <div className="bg-red-800 px-4 py-3 rounded-md">
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          useCase={UseCases.BODY}
        >
          {errorMessage}
        </Text>
      </div>

      <div className="flex justify-center mt-2">
        <Button
          backgroundColor={BackgroundColors.BLUE}
          fontWeight={FontWeights.BOLD}
          textColor={TextColors.WHITE}
          size={ButtonSize.LARGE}
          animateOnHover={false}
          onClick={() => router.push(ROUTES.MENU.DISCOVERY)}
        >
          Go back to homepage
        </Button>
      </div>
    </>
  )
};

export default ResourceNotFound;
