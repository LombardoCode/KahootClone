export interface TextProps {
  children: React.ReactNode;
  className?: string;
  textColor: TextColors;
  useCase: UseCases;
  fontWeight: FontWeights;
  textStyle?: TextStyles;
  onClick?: (e?: any) => void;
}

export enum TextColors {
  BLACK = "text-black",
  WHITE = "text-white",
  RED = "text-red-700",
  GRAY = "text-slate-700"
}

export enum UseCases {
  TITLE = "TITLE",
  HEADER = "HEADER",
  BODY = "BODY",
  LONGTEXT = "LONGTEXT",
  INLINE = "INLINE"
}

export enum FontWeights {
  BLACK = "fnt-montserrat-black",
  BOLD = "fnt-montserrat-bold",
  REGULAR = "fnt-montserrat-regular",
  LIGHT = "fnt-montserrat-light",
}

export enum TextStyles {
  NORMAL = "not-italic",
  ITALIC = "italic"
}