import { FontWeights, TextColors, TextProps, TextStyles, UseCases } from "@/app/interfaces/Text.interface";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  style: ['normal', 'italic']
});

const Text = ({
  children,
  textColor = TextColors.WHITE,
  fontWeight = FontWeights.LIGHT,
  useCase = UseCases.LONGTEXT,
  textStyle = TextStyles.NORMAL,
  className
}: TextProps) => {
  return (
    <>
      {useCase === "TITLE" && (
        <h1
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
        >
          {children}
        </h1>
      )}

      {useCase === "HEADER" && (
        <h2
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
        >
          {children}
        </h2>
      )}

      {useCase === "BODY" && (
        <h3
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
        >
          {children}
        </h3>
      )}

      {useCase === "LONGTEXT" && (
        <p
          className={`${montserrat.className} ${className} ${textColor} ${fontWeight} ${textStyle}`}
        >
          {children}
        </p>
      )}
    </>
  )
}

export default Text;
