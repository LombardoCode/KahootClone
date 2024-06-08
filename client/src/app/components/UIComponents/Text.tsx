interface TextProps {
  children: React.ReactNode;
  textColor: TextColors;
  fontStyle?: TextTypographies;
}

export enum TextColors {
  WHITE = "text-white"
}

export enum TextTypographies {
  LIGHT = "fnt-montserrat-light",
  REGULAR = "fnt-montserrat-regular",
  BOLD = "fnt-montserrat-bold",
  BLACK = "fnt-montserrat-black"
}


const Text = ({ children, textColor, fontStyle = TextTypographies.LIGHT }: TextProps) => {
  return (
    <p
      className={`${textColor} ${fontStyle} text-normal`}
    >
      {children}
    </p>
  )
}

export default Text;
