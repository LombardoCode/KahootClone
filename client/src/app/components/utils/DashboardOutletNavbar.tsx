'use client'

import useUserStore from "@/app/stores/useUserStore";
import React, { useEffect, useRef, useState } from "react";
import Text from "../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { DropDownContainer, DropDownItem } from "./Navbar";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, PerspectiveSize } from "../UIComponents/Button";
import { ROUTES } from "@/app/utils/Routes/routesUtils";
import KahootCreateModal from "./Modal/reusable/KahootCreateModal";
import InputForm, { InputFormTypes } from "../UIComponents/InputForm";
import axiosInstance from "@/app/utils/axiosConfig";
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
    <nav className={`bg-white py-3 px-4 w-full sticky top-0 shadow-sm shadow-zinc-300 z-30 ${className}`}>
      <div className="relative flex items-center justify-between" ref={dropdownRef}>
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
            className="w-full px-4 py-3"
            placeholder="Search public content"
            onEnterPress={() => executeKahootSearch()}
          />
        </div>

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
            className="flex items-center hover:bg-gray-400 px-3 py-2 select-none cursor-pointer"
          >
            <div id="user-data-photo" className="mr-3">
              {user.mediaUrl ? (
                <img
                  src={user.mediaUrl}
                  crossOrigin="anonymous"
                  className="top-0 left-0 min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
                />
              ) : (
                <div className="bg-kahoot-purple-variant-4 flex justify-center items-center w-full min-w-10 max-w-10 min-h-10 max-h-10 rounded-full">
                  <Logo
                    size={LogoSize.SMALL}
                    color={LogoColors.WHITE}
                  />
                </div>
              )}
            </div>

            <div id="user-data-username">
              {user.userName && (
                <div>
                  <Text
                    fontWeight={FontWeights.BOLD}
                    textColor={TextColors.BLACK}
                    useCase={UseCases.LONGTEXT}
                    onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
                  >
                    {user.userName}
                  </Text>
                </div>
              )}
            </div>

            <div id="user-data-caret">
              <FontAwesomeIcon
                className="ml-2"
                icon={faCaretDown}
              />
            </div>
          </div>
        </div>

        {toggleAccountDropdown && (
          <DropDownContainer>
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
