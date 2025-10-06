import Image from "next/image";
import Logo, { LogoColors, LogoSize } from "../Logo";

interface DisplayUsersPhotoProps {
  photo: string | null;
  size: "extra_small" | "small" | "medium" | "large";
}

const DisplayUsersPhoto = ({ photo, size = "small" }: DisplayUsersPhotoProps) => {
  const determinePhotoSize = (size: string) => {
    switch (size) {
      case "extra_small": return 32;
      case "small": return 40;
      case "medium": return 96;
      case "large": return 112;
    }
  }

  const pixelSize = determinePhotoSize(size);

  return (
    <div className="border-1.5 border-kahoot-purple-variant-3 rounded-full">
      {photo ? (
        <Image
          src={photo}
          alt="User profile photo"
          width={pixelSize}
          height={pixelSize}
          className="object-cover rounded-full"
          loading="lazy"
        />
      ) : (
        <div
          className="bg-kahoot-purple-variant-4 flex justify-center items-center rounded-full"
          style={{ width: pixelSize, height: pixelSize }}
        >
          <Logo
            id="logo-display-users-photo"
            size={LogoSize.SMALL}
            color={LogoColors.WHITE}
          />
        </div>
      )}
    </div>
  )
}

export default DisplayUsersPhoto;
