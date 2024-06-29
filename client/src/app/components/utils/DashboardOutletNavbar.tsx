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

interface DashboardOutletNavbarProps {
  fixed?: boolean;
  className?: string;
}

const DashboardOutletNavbar = ({ fixed = true, className = '' }: DashboardOutletNavbarProps) => {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
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
    <nav className={`bg-white py-3 px-4 w-full sticky top-0 shadow-sm shadow-zinc-300 ${className}`}>
      <div className="relative flex justify-end" ref={dropdownRef}>
        {user.userName && (
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
        )}
        {toggleAccountDropdown && (
          <DropDownContainer>
            <DropDownItem
              icon={<FontAwesomeIcon icon={faGear} />}
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
    </nav>
  )
}

export default DashboardOutletNavbar;
