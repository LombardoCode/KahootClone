import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import Modal, { ModalTypes } from "../Modal";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "@/app/components/UIComponents/Text";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosConfig";
import { KahootMetadata } from "@/app/interfaces/Kahoot/KahootMetadata.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import { createLobby } from "@/app/utils/Lobby/lobbyUtils";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/UIComponents/Spinners/Spinner";
import Logo, { LogoColors, LogoSize } from "../../Logo";

interface KahootSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKahootId: string | null;
}

const KahootSelectorModal = ({ isOpen, onClose, selectedKahootId }: KahootSelectorModalProps) => {
  const router = useRouter();
  const [kahootMetadata, setKahootMetadata] = useState<KahootMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const retrieveKahootInformation = async () => {
      if (selectedKahootId !== null) {
        await getKahootMetadata();
      }
    }

    retrieveKahootInformation();
  }, [selectedKahootId]);

  const getKahootMetadata = async () => {
    setLoading(true);
    await axiosInstance.get('/kahoot/getKahootMetadata', {
      params: {
        kahootId: selectedKahootId
      }
    })
      .then(res => {
        setLoading(false);
        setKahootMetadata(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <Modal
      modalType={ModalTypes.INPUT}
      isOpen={isOpen}
      onClose={() => {
        setKahootMetadata(null)
        onClose();
      }}
      className="w-[800px] max-w-[90vw]"
      bodyContent={(
        <>
          {loading ? (
            (
              <div className="flex justify-center items-center min-h-[20vh]">
                <Spinner className="text-kahoot-purple-variant-3" />
              </div>
            )
          ) : (
            <div
              id="image-and-kahoot-metadata-header-wrapper"
              className="grid grid-cols-12 gap-8"
            >
              <div id="image-wrapper" className="col-span-4">
                <img
                  src={kahootMetadata?.mediaUrl}
                  className="rounded-xl w-full h-40 object-cover"
                />
              </div>
              <div id="kahoot-metadata-wrapper" className="col-span-8 flex items-center">
                <div id="kahoot-metadata-content" className="w-full">
                  <div id="kahoot-metadata-content-title" className="mb-2">
                    <Text
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-2xl"
                    >
                      {kahootMetadata?.title}
                    </Text>
                  </div>

                  <div id="kahoot-metadata-content-owner-content" className="flex items-center mb-3 select-none">
                    <div id="kahoot-metadata-content-owner-content-photo" className="mr-2">
                      {kahootMetadata?.ownerInfo.mediaUrl ? (
                        <img
                          src={kahootMetadata.ownerInfo.mediaUrl}
                          crossOrigin="anonymous"
                          className="top-0 left-0 min-w-7 max-w-7 min-h-7 max-h-7 object-cover rounded-full"
                        />
                      ) : (
                        <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-full min-w-7 max-w-7 min-h-7 max-h-7 rounded-full">
                          <Logo
                            size={LogoSize.SMALL}
                            color={LogoColors.WHITE}
                          />
                        </div>
                      )}
                    </div>

                    <div id="kahoot-metadata-content-owner-content-username">
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm"
                      >
                        {kahootMetadata?.ownerInfo.userName}
                      </Text>
                    </div>
                  </div>

                  <div id="kahoot-metadata-content-description">
                    <Text
                      fontWeight={FontWeights.REGULAR}
                      textColor={TextColors.GRAY}
                      useCase={UseCases.LONGTEXT}
                      className="text-sm mb-4"
                    >
                      {kahootMetadata?.description}
                    </Text>
                  </div>

                  <div id="kahoot-metadata-plays-and-participants-wrapper" className="flex mb-4">
                    <div id="kahoot-metadata-plays" className="flex items-center mr-4">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className={`text-xs mr-1 ${TextColors.LIGHT_GRAY}`}
                      />

                      <Text
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.LIGHT_GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm"
                      >
                        {kahootMetadata?.timesPlayed} {kahootMetadata?.timesPlayed === 1 ? 'play' : 'plays'}
                      </Text>
                    </div>

                    <div id="kahoot-metadata-participants" className="flex items-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className={`text-xs mr-1 ${TextColors.LIGHT_GRAY}`}
                      />

                      <Text
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.LIGHT_GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm"
                      >
                        {kahootMetadata?.participants} {kahootMetadata?.participants === 1 ? 'participant' : 'participants'}
                      </Text>
                    </div>
                  </div>

                  <div id="kahoot-metadata-host-button">
                    <Button
                      backgroundColor={BackgroundColors.BLUE}
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.WHITE}
                      className={`text-md w-full ${kahootMetadata?.isPlayable ? 'opacity-100' : 'opacity-45'}`}
                      size={ButtonSize.MEDIUM}
                      perspective={PerspectiveSize.MEDIUM}
                      animateOnHover={false}
                      onClick={() => {
                        if (kahootMetadata?.isPlayable) {
                          createLobby(kahootMetadata.kahootId, router)
                        }
                      }}
                    >
                      Host
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default KahootSelectorModal;
