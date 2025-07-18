interface LogoProps {
  size: LogoSize;
  color?: LogoColors;
  className?: string;
}

export enum LogoSize {
  EXTRA_SMALL = "extra_small",
  SMALL = "small",
  REGULAR = "regular",
  LARGE = "large",
}

export enum LogoColors {
  WHITE = "#FFFFFF",
  VIOLET = "#46178F"
}

const sizeMap = {
  [LogoSize.EXTRA_SMALL]: { width: 40, height: 40 },
  [LogoSize.SMALL]: { width: 80, height: 100 },
  [LogoSize.REGULAR]: { width: 120, height: 68 },
  [LogoSize.LARGE]: { width: 250, height: 100 },
}

const Logo = ({ size = LogoSize.SMALL, color = LogoColors.WHITE, className }: LogoProps) => {
  const { width, height } = sizeMap[size];

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 586.66669 200"
        width={width}
        height={height}
        className={className}
      >
        <defs>
          <clipPath id="clipPath18" clipPathUnits="userSpaceOnUse">
            <path d="M 0,150 H 440 V 0 H 0 Z" />
          </clipPath>
        </defs>
        <g transform="matrix(1.3333333,0,0,-1.3333333,0,200)">
          <g>
            <g clipPath="url(#clipPath18)">
              <g transform="translate(104,31.4004)">
                <path
                  style={{ fill: color, fillOpacity: 1, fillRule: "nonzero", stroke: "none" }}
                  d="M 0,0 0.5,30.3 C -15.9,32.699 -16.2,10.699 -16.2,10.699 -14.6,-3.5 0,0 0,0 m -26.4,68.7 c 0,0 39.7,17.5 44.4,-14 L 17.4,-13 h -30.1 c 0,0 -13.2,-0.5 -17.3,14.1 0,0 -10.2,37.2 30,44.299 L 0.1,54.5 c 0,0 -7.6,8.1 -21.1,0 z M 336,98.8 320.2,-1.9 295,106.6 Z M 259.4,99 259.1,70.6 281.4,69.1 V 55.2 L 259.7,54 261.5,12 c 0,0 0.1,-3.301 6.9,-3.301 6.8,0 13.1,3.7 13.1,3.7 V -9 c 0.3,-6.5 -9,-9.301 -9,-9.301 C 242.7,-22.7 244.9,-3.2 244.9,-3.2 l -1,54.3 h -14 l -3.3,22.799 17.3,-0.599 v 32.099 z M 311.2,-9.601 h 13.4 l 5.1,-14.7 -12,-7.099 -12.2,8.4 z m -269,79 C 63.8,76.2 75.3,76.1 78.4,44.7 L 86.1,-9 H 65.7 L 64.4,22.1 62.5,44.2 C 62,59.7 47.9,55.8 43.6,53.899 L 44.7,-8.9 25.2,-8.2 22,113.399 41.8,118.6 Z M -21.5,82 -50,50.7 -31.1,-17.4 H -51.6 L -66.7,34.8 -81,21 l 0.2,-38.4 -23.2,0.799 V 93.1 L -80.8,99 V 52.3 l 39.2,37.4 z M 194,8.899 c 10.3,-1.2 19.1,8.201 18.5,20 C 211.9,40.8 207.1,48.2 197.4,48.399 187.7,48.6 181.8,37.5 182.9,24.6 183.8,14.8 189.9,9.399 194,8.899 m 2.3,55.301 c 18.8,-0.4 34.9,-16.1 36,-35.1 C 233.5,10 218.3,-7 198.4,-9 c -19.9,-2 -36,13.699 -36,35.1 0,21.4 15.2,38.4 33.9,38.1 M 136.2,26.6 c -0.8,-9.901 -7,-15.3 -11.1,-15.701 -10.3,-1.2 -19.1,8.101 -18.5,20 0.6,11.901 5.4,19.301 15.1,19.5 C 131.4,50.6 137.3,39.5 136.2,26.6 M 122.8,66.1 C 104.1,65.8 88,50 86.8,31 85.7,11.899 100.9,-5.101 120.7,-7.101 c 19.9,-2 36,13.8 36,35.101 0,21.399 -15.2,38.399 -33.9,38.1"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  )
}

export default Logo;
