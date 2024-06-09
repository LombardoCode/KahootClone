import Image from "next/image"

interface LogoProps {
  size: LogoSize;
  className?: string;
}

export enum LogoSize {
  SMALL = "small",
  REGULAR = "regular",
  LARGE = "large",
}

const sizeMap ={
  [LogoSize.SMALL]: { width: 80, height: 0 },
  [LogoSize.REGULAR]: { width: 100, height: 0 },
  [LogoSize.LARGE]: { width: 200, height: 0 },
}

const Logo = ({ size = LogoSize.SMALL, className }: LogoProps) => {
  const { width, height } = sizeMap[size];

  return (
    <Image
      src={"/Kahoot_Logo.svg"}
      alt={"Kahoot logo"}
      width={width}
      height={height}
      className={`${className}`}
    />
  )
}

export default Logo;
