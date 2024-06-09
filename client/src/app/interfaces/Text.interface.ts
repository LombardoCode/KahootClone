export interface TextProps {
  children: React.ReactNode;
  className?: string;
  textColor: TextColors;
  useCase: UseCases;
  fontWeight: FontWeights;
}

export enum TextColors {
  BLACK = "text-black",
  WHITE = "text-white"
}

export enum UseCases {
  TITLE = "TITLE",
  HEADER = "HEADER",
  BODY = "BODY",
  LONGTEXT = "LONGTEXT"
}

export enum FontWeights {
  BLACK = "fnt-montserrat-black",
  BOLD = "fnt-montserrat-bold",
  REGULAR = "fnt-montserrat-regular",
  LIGHT = "fnt-montserrat-light",
}