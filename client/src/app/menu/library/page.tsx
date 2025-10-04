'use client';

import Text from "../../components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "../../interfaces/Text.interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useRouter } from "next/navigation";
import { KahootDashboardList } from "../../interfaces/Kahoot/Dashboard/KahootDashboardList.interface";
import Logo, { LogoColors, LogoSize } from "@/app/components/utils/Logo";
import Button, { ButtonSize, PerspectiveSize } from "@/app/components/UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faServer, faTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { createLobby } from "@/app/utils/Lobby/lobbyUtils";
import Spinner from "@/app/components/UIComponents/Spinners/Spinner";
import Pagination from "@/app/components/utils/General/Pagination";
import DeleteKahootModal from "@/app/components/utils/Modal/reusable/DeleteKahootModal";

const LibraryMenuPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [kahootsFromUser, setKahootsFromUser] = useState<KahootDashboardList[]>([]);
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOfResults, setTotalOfResults] = useState<number>(0);

  useEffect(() => {
    const getInformation = async () => {
      setLoading(true);
      await getBasicInfoFromUsersKahoots();
      setLoading(false);
    }

    getInformation();
  }, [currentPage]);

  const getBasicInfoFromUsersKahoots = async () => {
    await axiosInstance.get('/kahoot/getBasicInfoFromUsersKahoots', {
      params: {
        pageSize,
        currentPage
      }
    })
      .then((res) => {
        setKahootsFromUser(res.data.kahoots);
        setTotalOfResults(res.data.totalResults);
      })
      .catch(err => {
        console.error(err);
      })
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner className="text-kahoot-purple-variant-3" />
      </div>
    )
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

      <div className="mb-7">
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
      </div>
      
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalOfResults={totalOfResults}
        setSelectedPage={(selectedPage: number) => setCurrentPage(selectedPage)}
      />
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleDelete = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <table className={`${className} w-full`}>
        <thead className="text-left">
          <tr>
            <th className="py-2 px-3 min-w-28 w-0"></th>
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
            <th className="py-2 px-10 whitespace-nowrap hidden lg:table-cell">
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
                {kahoot.mediaUrl === null ? (
                  <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-24 h-14 rounded-md">
                    <Logo
                      id="logo-library-page-table-of-kahoots"
                      size={LogoSize.EXTRA_SMALL}
                      color={LogoColors.WHITE}
                    />
                  </div>
                ) : (
                  <img
                    src={kahoot.mediaUrl}
                    className="w-24 h-14 rounded-md object-cover"
                  />
                )}
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

              <td className="py-2 px-3 text-center hidden lg:table-cell">
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
                      perspective={PerspectiveSize.MEDIUM}
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
                        fontWeight={FontWeights.BOLD}
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
                <KahootContextMenu
                  kahoot={kahoot}
                  router={router}
                  onDelete={handleDelete}
                  onMenuChange={setIsMenuOpen}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteKahootModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedKahootId={selectedKahootId}
        onRefreshKahoots={onRefreshKahoots}
      />
    </>
  )
}

interface KahootContextMenuProps {
  kahoot: KahootDashboardList;
  router: any;
  onDelete: (kahootId: string) => void;
  onMenuChange: (isOpen: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const KahootContextMenu = ({ kahoot, router, onDelete, onMenuChange, isMenuOpen, setIsMenuOpen }: KahootContextMenuProps) => {
  return (
    <>
      {/* UX: Placing a backdrop so the user cannot click on anything behind the menu until this menu closes */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <Menu
        align="end"
        direction="bottom"
        onMenuChange={(e) => onMenuChange(e.open)}
        className="z-40"
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
          className="bg-white hover:bg-slate-100 px-4 py-3 cursor-pointer"
          onClick={() => {
            if (kahoot.isPlayable && kahoot.id) {
              createLobby(kahoot.id, router)
            }
          }}
        >
          <div className={`flex items-center py-2 w-44 ${kahoot.isPlayable ? 'opacity-100' : 'opacity-45'}`}>
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
          className="bg-white hover:bg-slate-100 px-4 py-3 cursor-pointer"
          onClick={() => {
            if (kahoot.id) {
              onDelete(kahoot.id);
            }
          }}
        >
          <div className="flex items-center py-2 w-44">
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
    </>
  );
};

export default LibraryMenuPage;
