import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../UIComponents/Text";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCompass, faList } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface SidebarNavProps {
  className?: string;
}

interface SidebarMenuItemProps {
  name: string;
  pathname: string;
  icon: IconDefinition;
}

const SidebarNav = ({ className }: SidebarNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarPrimaryMenuItems: SidebarMenuItemProps[] = [
    { name: "Discover", pathname: ROUTES.MENU.DISCOVER, icon: faCompass },
    { name: "Library", pathname: ROUTES.MENU.LIBRARY, icon: faList }
  ];

  return (
    <div className={`${className} px-0.5 py-2 select-none`}>
      <div id="sidebar-primary-nav-items" className="px-1">
        {sidebarPrimaryMenuItems.map((item: SidebarMenuItemProps, key: number) => (
          <SidebarNavItem
            key={key}
            name={item.name}
            selected={item.pathname === pathname}
            icon={item.icon}
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
          icon={faCircleInfo}
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
  icon: IconDefinition;
  selected: boolean;
  onClick?: (i?: string) => void;
}

const SidebarNavItem = ({ children, icon, selected = false, onClick, name }: SidebarNavItemProps) => {
  return (
    <div
      className={`flex items-center rounded-md px-3 mb-1 cursor-pointer ${selected ? 'bg-violet-900' : 'hover:bg-zinc-300'}`}
      onClick={() => onClick && onClick(name)}
    >
      <FontAwesomeIcon
        icon={icon}
        size={'lg'}
        className={`${selected ? 'text-white' : 'text-black'}`}
      />

      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.LONGTEXT}
        textColor={selected ? TextColors.WHITE : TextColors.BLACK}
        className="px-3 py-2.5"
      >
        {children}
      </Text>
    </div>
  )
}

export default SidebarNav;
