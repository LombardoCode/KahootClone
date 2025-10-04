import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../UIComponents/Text";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCompass, faList, faXmark } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface SidebarNavProps {
  className?: string;
  isMobileBarOpen: boolean;
  setIsMobileBarOpen: (isOpen: boolean) => void;
}

interface SidebarMenuItemProps {
  text: string;
  pathname: string;
  icon: IconDefinition;
}

const SidebarNav = ({ className, isMobileBarOpen, setIsMobileBarOpen }: SidebarNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarPrimaryMenuItems: SidebarMenuItemProps[] = [
    { text: "Discover", pathname: ROUTES.MENU.DISCOVER, icon: faCompass },
    { text: "Library", pathname: ROUTES.MENU.LIBRARY, icon: faList }
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-white w-full h-full
      ${isMobileBarOpen ? "translate-x-0" : "-translate-x-full"}
      md:static md:translate-x-0 md:z-auto md:min-h-full md:min-w-[6rem] md:w-[6rem]
      lg:min-w-[14.5rem] lg:w-[14.5rem]
      px-0.5 py-2 select-none flex flex-col ${className}`}>
      <div
        id="mobile-close-sidebar"
        className="sm:hidden flex justify-end px-2 mb-4"
      >
        <FontAwesomeIcon
          icon={faXmark}
          size={'2xl'}
          className={`${TextColors.GRAY} w-min px-4 py-3 cursor-pointer hover:bg-slate-300 rounded-md`}
          onClick={() => setIsMobileBarOpen(false)}
        />
      </div>

      <div id="sidebar-items" className="flex-1 flex flex-col justify-between">
        <div id="sidebar-primary-nav-items" className="px-1">
          {sidebarPrimaryMenuItems.map((item: SidebarMenuItemProps, key: number) => (
            <SidebarNavItem
              key={key}
              text={item.text}
              selected={item.pathname === pathname}
              icon={item.icon}
              onClick={() => router.push(item.pathname)}
              setIsMobileBarOpen={(isOpen: boolean) => setIsMobileBarOpen(isOpen)}
            />
          ))}
        </div>

        <div id="secondary-nav-items">
          <SidebarNavItem
            text={"Credits"}
            selected={false}
            icon={faCircleInfo}
            onClick={() => {}}
            setIsMobileBarOpen={(isOpen: boolean) => setIsMobileBarOpen(isOpen)}
          />
        </div>
      </div>
    </div>
  )
}

interface SidebarNavItemProps {
  text: string;
  icon: IconDefinition;
  selected: boolean;
  onClick?: () => void;
  setIsMobileBarOpen: (isOpen: boolean) => void;
}

const SidebarNavItem = ({ text, icon, selected = false, onClick, setIsMobileBarOpen }: SidebarNavItemProps) => {
  const handleClick = () => {
    onClick?.();
    setIsMobileBarOpen(false);
  };

  return (
    <div
      className={`flex flex-row md:flex-col lg:flex-row items-center rounded-md px-3 mb-1 cursor-pointer py-2.5 ${selected ? 'bg-violet-900' : 'hover:bg-zinc-300 transition-all duration-150'}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={icon}
        size={'lg'}
        className={`mb-0 md:mb-2 lg:mb-0 ${selected ? 'text-white' : 'text-black'}`}
      />

      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.LONGTEXT}
        textColor={selected ? TextColors.WHITE : TextColors.BLACK}
        className="px-3 text-base md:text-xs lg:text-base"
      >
        {text}
      </Text>
    </div>
  )
}

export default SidebarNav;
