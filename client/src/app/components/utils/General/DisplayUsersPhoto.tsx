import Logo, { LogoColors, LogoSize } from "../Logo";

interface DisplayUsersPhotoProps {
  photo: string | null;
  size: "extra_small" | "small" | "medium" | "large";
}

const DisplayUsersPhoto = ({ photo, size = "small" }: DisplayUsersPhotoProps) => {
  const determinePhotoSize = () => {
    let photoSize: string = "";
    switch (size) {
      case "extra_small":
        photoSize = "min-w-8 max-w-8 min-h-8 max-h-8";
        break;
      case "small":
        photoSize = "min-w-10 max-w-10 min-h-10 max-h-10";
        break;
      case "medium":
        photoSize = "min-w-24 max-w-24 min-h-24 max-h-24"
        break;
      case "large":
        photoSize = "min-w-28 max-w-28 min-h-28 max-h-28"
        break;
    }

    return photoSize;
  }

  return (
    <div className="border-1.5 border-kahoot-purple-variant-3 rounded-full">
      {photo ? (
        <img
          src={photo}
          crossOrigin="anonymous"
          className={`top-0 left-0 object-cover rounded-full ${determinePhotoSize()}`}
        />
      ) : (
        <div className={`bg-kahoot-purple-variant-4 flex justify-center items-center w-full rounded-full ${determinePhotoSize()}`}>
          <Logo
            size={LogoSize.SMALL}
            color={LogoColors.WHITE}
          />
        </div>
      )}
    </div>
  )
}

export default DisplayUsersPhoto;
