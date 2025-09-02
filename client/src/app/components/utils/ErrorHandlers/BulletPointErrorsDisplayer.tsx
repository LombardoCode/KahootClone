import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";

interface BulletPointErrorsDisplayerProps {
  errors: string[];
}

const BulletPointErrorsDisplayer = ({ errors }: BulletPointErrorsDisplayerProps) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div id="login-form-errors">
      {errors.map((error: string, index: number) => (
        <Text
          key={index}
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.RED}
          useCase={UseCases.LONGTEXT}
          className="text-sm"
        >
          <Text
            key={index}
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.RED}
            useCase={UseCases.INLINE}
            className="text-xl mr-2"
          >
            •
          </Text>
          
          {error}
        </Text>
      ))}
    </div>
  )
}

export default BulletPointErrorsDisplayer;
