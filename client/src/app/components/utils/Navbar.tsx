import Logo, { LogoSize } from "./Logo";
import Container from "./Container";
import useUserStore from "@/app/stores/useUserStore";
import Text from "../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import montserrat from "@/app/utils/fontsConfig";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";
import Link from "next/link";
import { ROUTES } from "@/app/utils/Routes/routesUtils";

interface NavbarProps {
  hideLogo?: boolean;
  fixed?: boolean;
}

const Navbar = ({ hideLogo = false, fixed = true }: NavbarProps) => {
  const { user } = useUserStore();
  const [toggleAccountDropdown, setToggleAccountDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setToggleAccountDropdown(false);
    }
  };

  return (
    <nav className={`${fixed === true ? 'fixed' : ''} w-full`}>
      <div className={`top-0 bg-violet-900 py-3`}>
        <Container className={`flex items-center justify-between`}>
          {hideLogo === false && (
            <Link href={ROUTES.ROOT}>
              <Logo size={LogoSize.REGULAR} />
            </Link>
          )}
          <div className="relative" ref={dropdownRef}>
            {user.userName && (
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                useCase={UseCases.LONGTEXT}
                className="hover:bg-violet-950 px-3 py-2 select-none cursor-pointer"
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
                >
                  Sign out
                </DropDownItem>
              </DropDownContainer>
            )}
          </div>
        </Container>
      </div>
    </nav>
  )
}

interface DropDownContainer {
  children: React.ReactNode;
}

const DropDownContainer = ({ children }: DropDownContainer) => {
  return (
    <div
      id="account-dropdown-options"
      className="absolute top-full bg-white py-0 right-0 shadow-md shadow-gray-400 select-none w-60"
    >
      {children}
    </div>
  )
}

interface DropDownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  backgroundColor?: BackgroundColors;
  textColors?: TextColors;
  onClick?: (i?: any) => void;
}

const DropDownItem = ({ children, icon = <></>, backgroundColor = BackgroundColors.WHITE, textColors = TextColors.BLACK, onClick }: DropDownItemProps) => {
  return (
    <Text
      fontWeight={FontWeights.BOLD}
      textColor={TextColors.BLACK}
      useCase={UseCases.LONGTEXT}
      className={`px-3 py-3 cursor-pointer ${montserrat.className} ${backgroundColor} ${textColors}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span>{children}</span>
    </Text>
  )
}

export default Navbar;

export { DropDownItem, DropDownContainer };
