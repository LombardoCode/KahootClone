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

interface DashboardOutletNavbarProps {
  fixed?: boolean;
  className?: string;
  setIsKahootSearchWindowOpen: (isOpen: boolean) => void;
}

const DashboardOutletNavbar = ({ fixed = true, className = '', setIsKahootSearchWindowOpen }: DashboardOutletNavbarProps) => {
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

  const signOut = () => {
    clearUser();
    router.push('/');
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
          onClick={() => setIsKahootSearchWindowOpen(true)}
        >
          <InputForm
            type={InputFormTypes.TEXT}
            textColor={TextColors.BLACK}
            fontWeight={FontWeights.LIGHT}
            name="image-query"
            id="image-query"
            className="w-full px-4 py-3"
            placeholder="Search kahoots"
          />
        </div>

        <div
          id="create-kahoot-button-and-user-card-wrapper"
          className="whitespace-nowrap ml-4"
        >
          {user.userName && (
            <div className="flex items-center">
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
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                useCase={UseCases.LONGTEXT}
                className="hover:bg-gray-400 px-3 py-2 select-none cursor-pointer"
                onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
              >
                {user.userName}
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faCaretDown}
                />
              </Text>
            </div>
          )}
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
