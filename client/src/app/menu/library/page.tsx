'use client';

import Text from "../../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../../interfaces/Text.interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useRouter } from "next/navigation";
import { KahootDashboardList } from "../../interfaces/Kahoot/Dashboard/KahootDashboardList.interface";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import Button, { ButtonSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faServer, faTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import Modal, { ModalTypes } from "@/app/components/utils/Modal/Modal";
import { createLobby } from "@/app/utils/Lobby/lobbyUtils";

const LibraryMenuPage = () => {
  const [kahootsFromUser, setKahootsFromUser] = useState<KahootDashboardList[]>([]);

  useEffect(() => {
    getBasicInfoFromUsersKahoots();
  }, []);

  const getBasicInfoFromUsersKahoots = async () => {
    await axiosInstance.get('/kahoot/getBasicInfoFromUsersKahoots')
      .then((res) => {
        setKahootsFromUser(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className="text-3xl"
      >
        Your kahoots
      </Text>

      {kahootsFromUser.length === 0
        ? (
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.LONGTEXT}
          >
            You don&apos;t have any kahoots for now. Create your own Kahoot now!
          </Text>
        )
        : (
          <DisplayTableOfKahootsCreated
            kahoots={kahootsFromUser}
            className="mt-4"
            onRefreshKahoots={getBasicInfoFromUsersKahoots}
          />
        )}
    </>
  )
}

interface DisplayTableOfKahootsCreatedProps {
  kahoots: KahootDashboardList[];
  className?: string;
  onRefreshKahoots: () => void;
}

const DisplayTableOfKahootsCreated = ({ kahoots, className, onRefreshKahoots }: DisplayTableOfKahootsCreatedProps) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);

  const deleteKahoot = async (kahootIdToDelete: string | null) => {
    await axiosInstance.delete(`/kahoot/delete/${kahootIdToDelete}`)
      .then(res => {
        console.log(res.data);
        onRefreshKahoots();
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <table className={`${className} w-full`}>
        <thead className="text-left">
          <tr>
            <th className="py-2 px-3 w-0 whitespace-nowrap"></th>
            <th className="py-2 px-3 w-full">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-xs"
              >
                Title
              </Text>
            </th>
            <th className="py-2 px-10 whitespace-nowrap">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.GRAY}
                useCase={UseCases.LONGTEXT}
                className="text-xs"
              >
                Last modified
              </Text>
            </th>
            <th className="py-2 px-3 w-0 whitespace-nowrap"></th>
          </tr>
        </thead>

        <tbody>
          {kahoots.map((kahoot: KahootDashboardList, index: number) => (
            <tr key={index} className="group hover:bg-zinc-300">
              <td
                className="py-2 px-3 w-0 cursor-pointer"
                onClick={() => router.push(`/creator/${kahoot.id}`)}
              >
                <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-24 h-14 rounded-md">
                  <Logo
                    size={LogoSize.EXTRA_SMALL}
                    color={LogoColors.WHITE}
                  />
                </div>
              </td>
              <td
                className="py-2 px-3 cursor-pointer"
                onClick={() => router.push(`/creator/${kahoot.id}`)}
              >
                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.LONGTEXT}
                >
                  {kahoot.title}
                </Text>

                <Text
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.LIGHT_GRAY}
                  useCase={UseCases.LONGTEXT}
                  className="mt-1 text-xs"
                >
                  {kahoot.timesPlayed} {kahoot.timesPlayed === 1 ? 'play' : 'plays'}
                </Text>
              </td>

              <td className="py-2 px-3 text-center">
                <Text
                  fontWeight={FontWeights.REGULAR}
                  textColor={TextColors.GRAY}
                  useCase={UseCases.LONGTEXT}
                  className="group-hover:hidden mt-1 text-sm"
                >
                  Date
                </Text>

                {kahoot.isPlayable
                  ? (
                    <Button
                      backgroundColor={BackgroundColors.BLUE}
                      fontWeight={FontWeights.BOLD}
                      textColor={TextColors.WHITE}
                      className="hidden group-hover:inline-block text-sm"
                      size={ButtonSize.SMALL}
                      onClick={() => createLobby(kahoot.id, router)}
                      perspective={false}
                      animateOnHover={false}
                    >
                      Host
                    </Button>
                  )
                  : (
                    <div className="hidden group-hover:flex group-hover:items-center group-hover:justify-center select-none">
                      <FontAwesomeIcon
                        icon={faWarning}
                        className={`${TextColors.RED} mr-2`}
                      />
                      <Text
                        fontWeight={FontWeights.REGULAR}
                        textColor={TextColors.RED}
                        useCase={UseCases.LONGTEXT}
                        className="mt-1 text-sm whitespace-nowrap"
                      >
                        Not playable
                      </Text>
                    </div>
                  )}
              </td>
              <td className="px-3">
                <Menu
                  align="end"
                  direction="bottom"
                  menuButton={
                    <MenuButton className="cursor-pointer h-full px-6 py-3">
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        size="lg"
                        className={TextColors.LIGHT_GRAY}
                      />
                    </MenuButton>
                  }
                >
                  <MenuItem
                    className="bg-white hover:bg-slate-300 px-4 py-3 cursor-pointer w-36 shadow-md shadow-slate-400/60"
                    onClick={() => {
                      if (kahoot.isPlayable) {
                        createLobby(kahoot.id, router)
                      }
                    }}
                  >
                    <div className={`flex items-center ${kahoot.isPlayable ? 'opacity-100' : 'opacity-45'}`}>
                      <FontAwesomeIcon icon={faServer} className="mr-2" />
                      <Text
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm"
                      >
                        Host
                      </Text>
                    </div>
                  </MenuItem>
                  <MenuItem
                    className="bg-white hover:bg-slate-300 px-4 py-3 cursor-pointer w-36 shadow-md shadow-slate-400/60"
                    onClick={() => {
                      setSelectedKahootId(kahoot.id)
                      setIsDeleteModalOpen(true)
                    }}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      <Text
                        fontWeight={FontWeights.BOLD}
                        textColor={TextColors.GRAY}
                        useCase={UseCases.LONGTEXT}
                        className="text-sm"
                      >
                        Delete
                      </Text>
                    </div>
                  </MenuItem>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isDeleteModalOpen}
        title={`Delete Kahoot`}
        onClose={() => setIsDeleteModalOpen(false)}
        bodyContent={(
          <>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-base"
            >
              Are you sure you want to delete this kahoot?
            </Text>
          </>
        )}
        footerContent={(
          <>
            <Button
              backgroundColor={BackgroundColors.RED}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.MEDIUM}
              textColor={TextColors.WHITE}
              className="mr-2"
              onClick={() => {
                setIsDeleteModalOpen(false);
                deleteKahoot(selectedKahootId);
              }}
            >
              Delete
            </Button>
          </>
        )}
      />
    </>
  )
}

export default LibraryMenuPage;
