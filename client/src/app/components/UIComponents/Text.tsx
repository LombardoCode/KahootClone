import { FontWeights, TextColors, TextProps, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import montserrat from "@/app/utils/fontsConfig";

const Text = ({
  children,
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  useCase = UseCases.LONGTEXT,
  textStyle = TextStyles.NORMAL,
  onClick,
  className
}: TextProps) => {
  return (
    <>
      {useCase === "TITLE" && (
        <h1
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
          onClick={onClick}
        >
          {children}
        </h1>
      )}

      {useCase === "HEADER" && (
        <h2
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
          onClick={onClick}
        >
          {children}
        </h2>
      )}

      {useCase === "BODY" && (
        <h3
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
          onClick={onClick}
        >
          {children}
        </h3>
      )}

      {useCase === "LONGTEXT" && (
        <p
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
          onClick={onClick}
        >
          {children}
        </p>
      )}

      {useCase === "INLINE" && (
        <span
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
          onClick={onClick}
        >
          {children}
        </span>
      )}
    </>
  )
}

export default Text;
