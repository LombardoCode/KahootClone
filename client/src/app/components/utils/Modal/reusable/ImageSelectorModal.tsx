import InputForm, { InputFormTypes } from "@/app/components/UIComponents/InputForm";
import Modal, { ModalTypes } from "../Modal";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "@/app/components/UIComponents/Text";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useEffect, useState } from "react";
import usePexelsSearch from "@/app/hooks/usePexelsSearch";
import useUnsplashSearch from "@/app/hooks/useUnsplashSearch";
import SidebarTab from "../SidebarTab";
import { debugLog } from "@/app/utils/debugLog";
var debounce = require('lodash.debounce');

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePurpose: ExternalImagePurpose;
  onImageSelect: (url: string) => void;
}

export enum ExternalImagePurpose {
  KAHOOT_THUMBNAIL,
  QUESTION_IMAGE,
  PROFILE_PICTURE
}

enum ExternalImageService {
  Pexels,
  Unsplash
}

const ImageSelectorModal = ({
  isOpen,
  onClose,
  imagePurpose,
  onImageSelect
}: ImageSelectorModalProps) => {
  // Image query text
  const [imageQueryText, setImageQueryText] = useState<string>("");
  const [selectedExternalImageService, setSelectedExternalImageService] = useState<ExternalImageService>(ExternalImageService.Pexels);
  const [lastQueryByService, setLastQueryByService] = useState<Record<ExternalImageService, string>>({
    [ExternalImageService.Pexels]: "",
    [ExternalImageService.Unsplash]: ""
  });

  // Pexels
  const { search: searchPexels } = usePexelsSearch();
  const [pexelsResults, setPexelsResults] = useState<any[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState<boolean>(false);
  const [pexelsSearchWasDoneAtLeastOnce, setPexelsSearchWasDoneAtLeastOnce] = useState<boolean>(false);

  // Unsplash
  const { search: searchUnsplash } = useUnsplashSearch();
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState<boolean>(false);
  const [unsplashSearchWasDoneAtLeastOnce, setUnsplashSearchWasDoneAtLeastOnce] = useState<boolean>(false);

  const determineWhichQualityToSaveImage = (photoResolutions: any) => {
    let mediaUrl: string = "";

    switch (selectedExternalImageService) {
      case ExternalImageService.Pexels:
        if (imagePurpose === ExternalImagePurpose.KAHOOT_THUMBNAIL) {
          // Original photo from API
          const originalPhoto: string = photoResolutions.original;

          // 3:2 aspect ratio
          const width: number = 350; const height: number = 233.33;
          const compressor: string = `?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;

          // Build the final image URL
          mediaUrl = getFinalMediaUrl(originalPhoto, compressor);
          debugLog(`Pexels - Kahoot Thumbnail`);
        }

        if (imagePurpose === ExternalImagePurpose.QUESTION_IMAGE) {
          const originalPhoto: string = photoResolutions.medium;
          mediaUrl = originalPhoto;
          debugLog(`Pexels - Question Image`);
        }

        if (imagePurpose === ExternalImagePurpose.PROFILE_PICTURE) {
          const originalPhoto: string = photoResolutions.medium;
          mediaUrl = originalPhoto;
          debugLog(`Pexels - Profile picture`);
        }

        break;

      case ExternalImageService.Unsplash:
        if (imagePurpose === ExternalImagePurpose.KAHOOT_THUMBNAIL) {
          // Original photo from API
          const originalPhoto: string = photoResolutions.raw;

          // 3:2 aspect ratio
          const width: number = 350; const height: number = 233.33;
          const compressor = `&fit=crop&w=${width}&h=${height}`;

          // Build the final image URL
          mediaUrl = getFinalMediaUrl(originalPhoto, compressor);
          debugLog(`Unsplash - Kahoot Thumbnail`);
        }

        if (imagePurpose === ExternalImagePurpose.QUESTION_IMAGE) {
          const originalPhoto: string = photoResolutions.regular;
          mediaUrl = originalPhoto;
          debugLog(`Unsplash - Question Image`);
        }

        if (imagePurpose === ExternalImagePurpose.PROFILE_PICTURE) {
          const originalPhoto: string = photoResolutions.regular;
          mediaUrl = originalPhoto;
          debugLog(`Unsplash - Profile picture`);
        }

        break;
    }

    onImageSelect(mediaUrl);
  }

  const getFinalMediaUrl = (originalPhoto: string, compressor: string): string => {
    return `${originalPhoto}${compressor}`;
  }

  useEffect(() => {
    if (!imageQueryText) {
      return;
    }

    if (lastQueryByService[selectedExternalImageService] === imageQueryText) {
      return;
    }

    selectedExternalImageService === ExternalImageService.Pexels
      ? setPexelsSearchWasDoneAtLeastOnce(false)
      : setUnsplashSearchWasDoneAtLeastOnce(false)

    const performImageSearch = debounce(() => {
      if (selectedExternalImageService === ExternalImageService.Pexels) {
        setPexelsLoading(true);
        searchPexels(imageQueryText, 1000, 30).then(results => {
          setPexelsResults(results);
          setPexelsSearchWasDoneAtLeastOnce(true);
          setPexelsLoading(false);
          setLastQueryByService(prev => ({
            ...prev,
            [ExternalImageService.Pexels]: imageQueryText
          }));
        });
      } else if (selectedExternalImageService === ExternalImageService.Unsplash) {
        setUnsplashLoading(true);
        searchUnsplash(imageQueryText, 1000, 30).then(results => {
          setUnsplashResults(results);
          setUnsplashSearchWasDoneAtLeastOnce(true);
          setUnsplashLoading(false);
          setLastQueryByService(prev => ({
            ...prev,
            [ExternalImageService.Unsplash]: imageQueryText
          }))
        })
      }
    }, 1000)

    performImageSearch();

    return () => {
      performImageSearch.cancel();
    }
  }, [imageQueryText, selectedExternalImageService]);

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      onClose={() => {
        setSelectedExternalImageService(ExternalImageService.Pexels);
        onClose();
      }}
      className="w-[1000px] max-w-[90vw] min-h-[80vh]"
      bodyContent={(
        <>
          <div
            id="image-search-text-box"
            className="sticky top-0 z-10 bg-white pb-2 pt-4 px-4"
          >
            <InputForm
              type={InputFormTypes.TEXT}
              textColor={TextColors.BLACK}
              fontWeight={FontWeights.LIGHT}
              name="image-query"
              id="image-query"
              value={imageQueryText}
              className="w-full py-3"
              placeholder="Search images (eg. tech, gaming, music...)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageQueryText(e.target.value)}
            />
          </div>

          <div
            id="external-image-services-wrapper"
            className="grid grid-cols-12"
          >
            <div
              id="external-image-services-selector"
              className="col-span-3"
            >
              <SidebarTab
                text={'Pexels'}
                onClick={() => setSelectedExternalImageService(ExternalImageService.Pexels)}
                selected={selectedExternalImageService === ExternalImageService.Pexels}
              />
              <SidebarTab
                text={'Unsplash'}
                onClick={() => setSelectedExternalImageService(ExternalImageService.Unsplash)}
                selected={selectedExternalImageService === ExternalImageService.Unsplash}
              />
            </div>
            <div
              id="external-image-services-preview"
              className="col-span-9 px-3"
            >
              <div>
                <div
                  id="images-provided-by-pexels-wrapper"
                  className="flex justify-end"
                >
                  <Text
                    fontWeight={FontWeights.REGULAR}
                    textColor={TextColors.GRAY}
                    useCase={UseCases.LONGTEXT}
                    className="text-sm"
                  >
                    Images provided by {selectedExternalImageService === ExternalImageService.Pexels ? 'Pexels' : 'Unsplash'}
                  </Text>
                </div>

                <div
                  id="service-image-images-preview"
                  className="grid grid-cols-3 gap-3 mt-4 h-full overflow-y-auto px-10 py-6"
                >
                  <RenderPhotosRetrievedFromAPI
                    pexelsResults={pexelsResults}
                    pexelsLoading={pexelsLoading}
                    pexelsSearchWasDoneAtLeastOnce={pexelsSearchWasDoneAtLeastOnce}

                    unsplashResults={unsplashResults}
                    unsplashLoading={unsplashLoading}
                    unsplashSearchWasDoneAtLeastOnce={unsplashSearchWasDoneAtLeastOnce}

                    selectedExternalImageService={selectedExternalImageService}
                    determineWhichQualityToSaveImage={determineWhichQualityToSaveImage}
                    onClose={onClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      footerContent={(
        <Button
          backgroundColor={BackgroundColors.GRAY}
          fontWeight={FontWeights.BOLD}
          size={ButtonSize.MEDIUM}
          textColor={TextColors.WHITE}
          className="mr-2"
          animateOnHover={false}
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
    />
  )
}

interface RenderPhotosRetrievedFromAPIProps {
  // Pexels
  pexelsResults: any[];
  pexelsLoading: boolean;
  pexelsSearchWasDoneAtLeastOnce: boolean;

  // Unsplash
  unsplashResults: any[];
  unsplashLoading: boolean;
  unsplashSearchWasDoneAtLeastOnce: boolean;

  // Both
  selectedExternalImageService: ExternalImageService;
  determineWhichQualityToSaveImage: (photoResolutions: any) => void;
  onClose: () => void;
}

const RenderPhotosRetrievedFromAPI = ({ selectedExternalImageService, pexelsResults, pexelsLoading, pexelsSearchWasDoneAtLeastOnce, unsplashResults, unsplashLoading, unsplashSearchWasDoneAtLeastOnce, determineWhichQualityToSaveImage, onClose }: RenderPhotosRetrievedFromAPIProps) => {
  return (
    <>
      {selectedExternalImageService === ExternalImageService.Pexels
        ? (
          <PexelsImagePreviewer
            searchWasDoneAtLeastOnce={pexelsSearchWasDoneAtLeastOnce}
            images={pexelsResults}
            loading={pexelsLoading}
            onImageSelect={determineWhichQualityToSaveImage}
            onClose={onClose}
          />
        )
        : (
          <UnsplashImagePreviewer
            searchWasDoneAtLeastOnce={unsplashSearchWasDoneAtLeastOnce}
            images={unsplashResults}
            loading={unsplashLoading}
            onImageSelect={determineWhichQualityToSaveImage}
            onClose={onClose}
          />
        )}
    </>
  )
}

interface PexelsImagePreviewerProps {
  searchWasDoneAtLeastOnce: boolean;
  images: any[];
  loading: boolean;
  onImageSelect: (photoResolutions: any) => void;
  onClose: () => void;
}

const PexelsImagePreviewer = ({ searchWasDoneAtLeastOnce, images, loading, onImageSelect, onClose }: PexelsImagePreviewerProps) => {
  const noResultsMessage: string = "No results were found.";

  if (loading) {
    return (
      <Text
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-sm col-span-3 text-center"
      >
        Loading...
      </Text>
    )
  }

  if (!loading && images.length <= 0 && searchWasDoneAtLeastOnce) {
    return (
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.BODY}
        className="col-span-3 text-center"
      >
        {noResultsMessage}
      </Text>
    )
  }

  return (
    <>
      {images.map((photo: any) => (
        <div
          key={photo.id}
          className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/30"
          onClick={() => {
            onImageSelect(photo.src);
            onClose();
          }}
        >
          <img
            src={photo.src.medium}
            alt={photo.alt || "pexels image"}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      ))}
    </>
  )
}

interface UnsplashImagePreviewerProps {
  searchWasDoneAtLeastOnce: boolean;
  images: any[];
  loading: boolean;
  onImageSelect: (photoResolutions: any) => void;
  onClose: () => void;
}

const UnsplashImagePreviewer = ({ searchWasDoneAtLeastOnce, images, loading, onImageSelect, onClose }: UnsplashImagePreviewerProps) => {
  const noResultsMessage: string = "No results were found.";

  if (loading) {
    return (
      <Text
        fontWeight={FontWeights.REGULAR}
        textColor={TextColors.GRAY}
        useCase={UseCases.LONGTEXT}
        className="text-sm col-span-3 text-center"
      >
        Loading...
      </Text>
    )
  }

  if (!loading && images.length <= 0 && searchWasDoneAtLeastOnce) {
    return (
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.GRAY}
        useCase={UseCases.BODY}
        className="col-span-3 text-center"
      >
        {noResultsMessage}
      </Text>
    )
  }

  return (
    <>
      {images.map((photo: any) => (
        <div
          key={photo.id}
          className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/30"
          onClick={() => {
            onImageSelect(photo.urls);
            onClose();
          }}
        >
          <img
            src={photo.urls.small}
            alt={`Image by ${photo.user?.name || "Unsplash"}: ${photo.alt_description || "photo"}`}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      ))}
    </>
  )
}

export default ImageSelectorModal;
