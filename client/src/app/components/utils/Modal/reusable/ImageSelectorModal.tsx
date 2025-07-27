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
var debounce = require('lodash.debounce');

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (url: string) => void;
}

enum ExternalImageService {
  Pexels,
  Unsplash
}

const ImageSelectorModal = ({
  isOpen,
  onClose,
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

  // Unsplash
  const { search: searchUnsplash } = useUnsplashSearch();
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!imageQueryText) {
      return;
    }

    if (lastQueryByService[selectedExternalImageService] === imageQueryText) {
      return;
    }

    const performImageSearch = debounce(() => {
      if (selectedExternalImageService === ExternalImageService.Pexels) {
        setPexelsLoading(true);
        searchPexels(imageQueryText, 1000, 30).then(results => {
          setPexelsResults(results);
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
                  {selectedExternalImageService === ExternalImageService.Pexels
                    ? (
                      <PexelsImagePreviewer
                        images={pexelsResults}
                        loading={pexelsLoading}
                        onImageSelect={onImageSelect}
                        onClose={onClose}
                      />
                    )
                    : (
                      <UnsplashImagePreviewer
                        images={unsplashResults}
                        loading={unsplashLoading}
                        onImageSelect={onImageSelect}
                        onClose={onClose}
                      />
                    )}
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

interface PexelsImagePreviewerProps {
  images: any[];
  loading: boolean;
  onImageSelect: (url: string) => void;
  onClose: () => void;
}

const PexelsImagePreviewer = ({ images, loading, onImageSelect, onClose }: PexelsImagePreviewerProps) => {
  return (
    <>
      {loading ? (
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.GRAY}
          useCase={UseCases.LONGTEXT}
          className="text-sm col-span-3 text-center"
        >
          Loading...
        </Text>
      ) : (
        images.map((photo: any) => (
          <div
            key={photo.id}
            className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
            onClick={() => {
              onImageSelect(photo.src.large);
              onClose();
            }}
          >
            <img
              src={photo.src.medium}
              alt={photo.alt || "pexels image"}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        ))
      )}
    </>
  )
}

interface UnsplashImagePreviewerProps {
  images: any[];
  loading: boolean;
  onImageSelect: (url: string) => void;
  onClose: () => void;
}

const UnsplashImagePreviewer = ({ images, loading, onImageSelect, onClose }: UnsplashImagePreviewerProps) => {
  return (
    <>
      {loading ? (
        <Text
          fontWeight={FontWeights.REGULAR}
          textColor={TextColors.GRAY}
          useCase={UseCases.LONGTEXT}
          className="text-sm col-span-3 text-center"
        >
          Loading...
        </Text>
      ) : (
        images.map((photo: any) => (
          <div
            key={photo.id}
            className="cursor-pointer rounded-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
            onClick={() => {
              onImageSelect(photo.urls.full);
              onClose();
            }}
          >
            <img
              src={photo.urls.small}
              alt={`Image by ${photo.user?.name || "Unsplash"}: ${photo.alt_description || "photo"}`}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        ))
      )}
    </>
  )
}

export default ImageSelectorModal;
