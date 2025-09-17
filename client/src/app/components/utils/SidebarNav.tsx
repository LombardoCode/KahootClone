import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "./Logo";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCompass, faList } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface SidebarNavProps {
  className?: string;
}

interface SidebarMenuItemProps {
  name: string;
  pathname: string;
  icon: IconProp;
}

const SidebarNav = ({ className }: SidebarNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarPrimaryMenuItems: SidebarMenuItemProps[] = [
    { name: "Discover", pathname: ROUTES.MENU.DISCOVER, icon: faCompass },
    { name: "Library", pathname: ROUTES.MENU.LIBRARY, icon: faList }
  ];

  return (
    <div className={`${className} px-0.5 py-2 shadow-[inset_0_0px_4px_rgba(0,0,0,0.25)]`}>
      <div id="sidebar-primary-nav-items" className="px-1">
        {sidebarPrimaryMenuItems.map((item: SidebarMenuItemProps, key: number) => (
          <SidebarNavItem
            key={key}
            name={item.name}
            selected={item.pathname === pathname}
            icon={<FontAwesomeIcon icon={item.icon} />}
            onClick={() => router.push(item.pathname)}
          >
            {item.name}
          </SidebarNavItem>
        ))}
      </div>

      <div id="secondary-nav-items">
        <SidebarNavItem
          name={"Other option"}
          selected={false}
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
          onClick={() => {}}
        >
          Credits
        </SidebarNavItem>
      </div>
    </div>
  )
}

interface SidebarNavItemProps {
  children: React.ReactNode;
  name: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick?: (i?: string) => void;
}

const SidebarNavItem = ({ children, icon = <></>, selected = false, onClick, name }: SidebarNavItemProps) => {
  return (
    <div
      className={`flex items-center rounded-md px-3 mb-1 cursor-pointer ${selected ? 'bg-violet-900' : 'hover:bg-zinc-300'}`}
      onClick={() => onClick && onClick(name)}
    >
      {icon && (
        <span className={`${selected ? 'text-white' : 'text-black'}`}>{icon}</span>
      )}
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.LONGTEXT}
        textColor={selected ? TextColors.WHITE : TextColors.BLACK}
        className="px-3 py-2"
      >
        {children}
      </Text>
    </div>
  )
}

export default SidebarNav;
