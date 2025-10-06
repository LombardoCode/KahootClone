'use client'

import useUserStore from "@/app/stores/useUserStore";
import React, { useEffect, useRef, useState } from "react";
import { FontWeights, TextColors } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faPlus, faRightFromBracket, faSearch } from "@fortawesome/free-solid-svg-icons";
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
  isMobileBarOpen: boolean;
  setIsMobileBarOpen: (isOpen: boolean) => void;
}

const DashboardOutletNavbar = ({
  fixed = true,
  className = '',
  setIsKahootSearchWindowOpen,
  kahootSearchQuery,
  setKahootSearchQuery,
  executeKahootSearch,
  navbarRef: activatorRef,
  isMobileBarOpen,
  setIsMobileBarOpen
}: DashboardOutletNavbarProps) => {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const [isCreateKahootModalOpen, setIsCreateKahootModalOpen] = useState<boolean>(false);
  const [toggleAccountDropdown, setToggleAccountDropdown] = useState<boolean>(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState<boolean>(false);
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
    <nav className={`flex justify-between items-center bg-white px-4 w-full sticky top-0 z-30 border-b-1 border-b-zinc-300 h-14 lg:h-16 ${className}`}>
      <div
        id="dashboard-outlet-navbar-logo"
        className={`flex items-center justify-start ${isMobileSearchActive ? 'lg:flex hidden' : 'flex'}`}
      >
        <div
          id="menu-bars"
          className="md:hidden mr-3 hover:bg-slate-300 px-3 py-3 rounded-md cursor-pointer"
          onClick={() => setIsMobileBarOpen(!isMobileBarOpen)}
        >
          <FontAwesomeIcon
            icon={faBars}
            size={'xl'}
            className={`${TextColors.PURPLE_VARIANT_4}`}
          />
        </div>

        <Link href={ROUTES.MENU.DISCOVER} aria-label="Go to Discover page">
          <Logo
            id="logo-dashboard"
            size={LogoSize.REGULAR}
            color={LogoColors.VIOLET}
          />
        </Link>
      </div>

      <div
        id="dashboard-outlet-navbar-searchbox"
        className={`relative ${isMobileSearchActive ? 'flex' : 'hidden'} lg:flex lg:items-center lg:justify-between ${isMobileSearchActive ? 'w-full' : 'lg:min-w-[36rem] xl:min-w-[50rem]'}`}
      >
        <div
          className="w-full"
          ref={activatorRef}
          onClick={() => setIsKahootSearchWindowOpen(true)}
        >
          <InputForm
            type={InputFormTypes.TEXT}
            textColor={TextColors.BLACK}
            fontWeight={FontWeights.REGULAR}
            name="image-query"
            id="image-query"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKahootSearchQuery(e.target.value)}
            value={kahootSearchQuery}
            className={`w-full px-4 py-2 ${TextColors.GRAY}`}
            placeholder="Search public content"
            leftElement={
              <FontAwesomeIcon
                icon={faSearch}
                className={`${TextColors.GRAY}`}
              />
            }
            borderSize={BorderSize.SMALL}
            onEnterPress={() => executeKahootSearch()}
          />
        </div>

        {isMobileSearchActive && (
          <Button
            id="mobile-search-cancel-button"
            backgroundColor={BackgroundColors.ZINC}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.SMALL}
            textColor={TextColors.GRAY}
            className="lg:hidden ml-2"
            onClick={() => setIsMobileSearchActive(false)}
            perspective={PerspectiveSize.NO_PERSPECTIVE}
            animateOnHover={false}
          >
            Cancel
          </Button>
        )}
      </div>

      <div id="dashboard-outlet-navbar-buttons-and-user-options-wrapper">
        <div
          id="create-kahoot-button-and-user-card-wrapper"
          className={`flex items-center whitespace-nowrap ml-4 ${isMobileSearchActive ? 'lg:flex hidden' : 'flex'}`}
        >
          <Button
            id="mobile-search-button"
            backgroundColor={BackgroundColors.ZINC}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.SMALL}
            textColor={TextColors.GRAY}
            className="lg:hidden mr-2"
            onClick={() => {
              setIsMobileSearchActive(true);
              setIsKahootSearchWindowOpen(true);
            }}
            perspective={PerspectiveSize.MEDIUM}
            animateOnHover={false}
            aria_label="Search"
          >
            <FontAwesomeIcon
              icon={faSearch}
              size={'sm'}
              className={`${TextColors.PURPLE_VARIANT_4}`}
            />
          </Button>

          <Button
            id="create-kahoot-button"
            backgroundColor={BackgroundColors.BLUE}
            fontWeight={FontWeights.BOLD}
            size={ButtonSize.SMALL}
            textColor={TextColors.WHITE}
            className="mr-2 w-min lg:w-32"
            onClick={() => setIsCreateKahootModalOpen(true)}
            perspective={PerspectiveSize.MEDIUM}
            animateOnHover={false}
            aria_label="Create Kahoot"
          >
            <span className="hidden lg:block text-lg">Create</span>

            <span className="lg:hidden px-0.5">
              <FontAwesomeIcon icon={faPlus} size="sm" />
            </span>
          </Button>

          <div className="relative" ref={dropdownRef}>
            <div
              id="user-data"
              className="flex items-center px-3 py-2 select-none cursor-pointer"
              onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
            >
              <div id="user-data-photo">
                <DisplayUsersPhoto photo={user.mediaUrl} size={"small"} />
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
        </div>
      </div>

      <KahootCreateModal
        isOpen={isCreateKahootModalOpen}
        onClose={() => setIsCreateKahootModalOpen(false)}
      />
    </nav>
  )
}

export default DashboardOutletNavbar;
