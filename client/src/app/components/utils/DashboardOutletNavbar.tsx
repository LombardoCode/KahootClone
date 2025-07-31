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
import useModalStore from "@/app/stores/useModalStore";
import Modal, { ModalTypes } from "./Modal/Modal";
import InputForm, { InputFormTypes } from "../UIComponents/InputForm";
import axiosInstance from "@/app/utils/axiosConfig";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface DashboardOutletNavbarProps {
  fixed?: boolean;
  className?: string;
}

const DashboardOutletNavbar = ({ fixed = true, className = '' }: DashboardOutletNavbarProps) => {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { isOpen, setIsOpen, closeModal } = useModalStore();
  const [toggleAccountDropdown, setToggleAccountDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    newKahootName: ''
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const createKahoot = () => {
    axiosInstance.post('/kahootcreator/create', { NewKahootName: formData.newKahootName })
      .then(res => {
        router.push(`/creator/${res.data.newKahootId}`);
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <nav className={`bg-white py-3 px-4 w-full sticky top-0 shadow-sm shadow-zinc-300 z-30 ${className}`}>
      <div className="relative flex justify-end" ref={dropdownRef}>
        {user.userName && (
          <div className="flex items-center">
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.SMALL}
              textColor={TextColors.WHITE}
              className="mr-2"
              onClick={() => setIsOpen(true)}
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
      <Modal
        modalType={ModalTypes.INPUT}
        isOpen={isOpen}
        title={`Create a Kahoot`}
        onClose={closeModal}
        bodyContent={(
          <>
            <Text
              fontWeight={FontWeights.REGULAR}
              textColor={TextColors.BLACK}
              useCase={UseCases.LONGTEXT}
              className="text-base"
            >
              Enter the name of your new Kahoot
            </Text>
            <InputForm
              type={InputFormTypes.TEXT}
              textColor={TextColors.BLACK}
              fontWeight={FontWeights.LIGHT}
              name="newKahootName"
              id="newKahootName"
              value={formData.newKahootName}
              onChange={handleFormChange}
            />
          </>
        )}
        footerContent={(
          <>
            <Button
              backgroundColor={BackgroundColors.GREEN}
              fontWeight={FontWeights.BOLD}
              size={ButtonSize.MEDIUM}
              textColor={TextColors.WHITE}
              className="mr-2"
              onClick={() => createKahoot()}
            >
              Create
            </Button>
          </>
        )}
      />
    </nav>
  )
}

export default DashboardOutletNavbar;
