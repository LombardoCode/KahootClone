'use client'

import useUserStore from "@/app/stores/useUserStore";
import React, { useEffect, useRef, useState } from "react";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { DropDownContainer, DropDownItem } from "./Navbar";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, PerspectiveSize } from "../UIComponents/Button";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import KahootCreateModal from "./Modal/reusable/KahootCreateModal";
import InputForm, { BorderSize, InputFormTypes } from "../UIComponents/InputForm";
import axiosInstance from "@/app/utils/axiosConfig";
import DisplayUsersPhoto from "./General/DisplayUsersPhoto";
import DisplayUsersUsername from "./General/DisplayUsersUsername";
import Link from "next/link";
import Logo, { LogoColors, LogoSize } from "./Logo";

interface DashboardOutletNavbarProps {
  fixed?: boolean;
  className?: string;
  setIsKahootSearchWindowOpen: (isOpen: boolean) => void;
  kahootSearchQuery: string;
  setKahootSearchQuery: (queryText: string) => void;
  executeKahootSearch: () => void;
  navbarRef?: React.RefObject<HTMLDivElement>;
}

const DashboardOutletNavbar = ({
  fixed = true,
  className = '',
  setIsKahootSearchWindowOpen,
  kahootSearchQuery,
  setKahootSearchQuery,
  executeKahootSearch,
  navbarRef: activatorRef
}: DashboardOutletNavbarProps) => {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const [isCreateKahootModalOpen, setIsCreateKahootModalOpen] = useState<boolean>(false);
  const [toggleAccountDropdown, setToggleAccountDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const signOut = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearUser();
      router.push(ROUTES.ROOT);
    }
  }

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setToggleAccountDropdown(false);
    }
  };

  return (
    <nav className={`flex justify-between items-center bg-white px-4 w-full sticky top-0 shadow-sm shadow-zinc-300 z-30 ${className}`}>
      <div
        id="dashboard-outlet-navbar-logo"
        className="flex justify-start"
      >
        <Link href={ROUTES.MENU.DISCOVER}>
          <Logo size={LogoSize.REGULAR} color={LogoColors.VIOLET} />
        </Link>
      </div>

      <div
        id="dashboard-outlet-navbar-searchbox"
        className="relative flex items-center justify-between min-w-[50rem]" ref={dropdownRef}
      >
        <div
          className="w-full"
          ref={activatorRef}
          onClick={() => setIsKahootSearchWindowOpen(true)}
        >
          <InputForm
            type={InputFormTypes.TEXT}
            textColor={TextColors.BLACK}
            fontWeight={FontWeights.LIGHT}
            name="image-query"
            id="image-query"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKahootSearchQuery(e.target.value)}
            value={kahootSearchQuery}
            className="w-full px-4 py-2"
            placeholder="Search public content"
            borderSize={BorderSize.SMALL}
            onEnterPress={() => executeKahootSearch()}
          />
        </div>
      </div>

      <div id="dashboard-outlet-navbar-buttons-and-user-options-wrapper">
        <div
          id="create-kahoot-button-and-user-card-wrapper"
          className="flex items-center whitespace-nowrap ml-4"
        >
          <div id="create-kahoot-button">
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.SMALL}
              textColor={TextColors.WHITE}
              className="mr-2"
              onClick={() => setIsCreateKahootModalOpen(true)}
              perspective={PerspectiveSize.MEDIUM}
              animateOnHover={false}
            >
              Create a Kahoot!
            </Button>
          </div>

          <div
            id="user-data"
            className="flex items-center px-3 py-2 select-none cursor-pointer"
            onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
          >
            <div id="user-data-photo">
              <DisplayUsersPhoto photo={user.mediaUrl} size={"small"} />
            </div>
          </div>
        </div>

        {toggleAccountDropdown && (
          <DropDownContainer>
            <div
              id="users-photo-and-username-wrapper"
              className="flex flex-col items-center py-4"
            >
              <div id="users-photo-and-username-content-photo" className="mb-3">
                <DisplayUsersPhoto photo={user.mediaUrl} size={"medium"} />
              </div>
              <div id="users-photo-and-username-content-username">
                <DisplayUsersUsername username={user.userName} />
              </div>
            </div>

            <DropDownItem
              icon={<FontAwesomeIcon icon={faGear} />}
              onClick={() => router.push(ROUTES.ADMINISTRATION.SETTINGS.PROFILE)}
            >
              Settings
            </DropDownItem>

            <DropDownItem
              icon={<FontAwesomeIcon icon={faRightFromBracket} />}
              backgroundColor={BackgroundColors.RED}
              textColors={TextColors.WHITE}
              onClick={() => signOut()}
            >
              Sign out
            </DropDownItem>
          </DropDownContainer>
        )}
      </div>

      <KahootCreateModal
        isOpen={isCreateKahootModalOpen}
        onClose={() => setIsCreateKahootModalOpen(false)}
      />
    </nav>
  )
}

export default DashboardOutletNavbar;
