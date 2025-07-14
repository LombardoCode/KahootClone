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
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

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
          />
        )}
    </>
  )
}

interface DisplayTableOfKahootsCreatedProps {
  kahoots: KahootDashboardList[];
  className?: string;
}

const DisplayTableOfKahootsCreated = ({ kahoots, className }: DisplayTableOfKahootsCreatedProps) => {
  const router = useRouter();

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
            <th className="py-2 px-3 whitespace-nowrap">
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

                <Button
                  backgroundColor={BackgroundColors.BLUE}
                  fontWeight={FontWeights.BOLD}
                  textColor={TextColors.WHITE}
                  className="hidden group-hover:inline-block text-sm"
                  size={ButtonSize.SMALL}
                  onClick={() => { }}
                  perspective={false}
                  animateOnHover={false}
                >
                  Host
                </Button>
              </td>
              <td className="py-2 px-3">
                <div
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => {}}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default LibraryMenuPage;
