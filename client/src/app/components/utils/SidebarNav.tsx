import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../UIComponents/Text";
import Logo, { LogoColors, LogoSize } from "./Logo";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

interface SidebarNavProps {
  className?: string;
}

const SidebarNav = ({ className }: SidebarNavProps) => {
  const [sidebarItemName, setSidebarItemName] = useState<string[]>([
    "Home", "Settings", "More options"
  ]);
  const [selectedMenuName, setSelectedMenuName] = useState<string>(sidebarItemName[0]);

  const setMenuName = (itemName: string) => {
    setSelectedMenuName(itemName);
  }

  return (
    <div className={`${className} px-2 shadow-[inset_0_0px_4px_rgba(0,0,0,0.25)]`}>
      <div className="flex justify-start">
        <Logo size={LogoSize.REGULAR} color={LogoColors.VIOLET} />
      </div>
      <div id="sidebar-nav-items" className="px-1">
        {sidebarItemName.map((item: string, key: number) => (
          <SidebarNavItem
            key={key}
            name={item}
            selected={selectedMenuName === item}
            icon={<FontAwesomeIcon icon={faHome} />}
            onClick={() => setMenuName(item)}
          >
            {item}
          </SidebarNavItem>
        ))}
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
