"use client";

import { useState } from "react";
import Text from "../components/UIComponents/Text"
import { FontWeights, TextColors, UseCases } from "../interfaces/Text.interface"
import DashboardLayout from "../menu/layout"
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "../utils/Routes/routesUtils";

interface UserSettingsLayoutProps {
  children: React.ReactNode;
}

interface SettingsTabOption {
  id: string;
  text: string;
}

const UserSettingsLayout = ({ children }: UserSettingsLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [settingsTabOptions] = useState<SettingsTabOption[]>([
    { id: "profile", text: "Edit profile" },
    { id: "change-password", text: "Change password" }
  ]);

  const getLastPortionOfPath = () => {
    let paths: string[] = pathname.split('/');
    let lastPath: string = paths[paths.length - 1];
    return lastPath;
  }

  const [selectedTabOptionId, setSelectedTabOptionId] = useState<string>(getLastPortionOfPath());

  const handleSelect = (tabOptionId: string) => {
    setSelectedTabOptionId(tabOptionId);
    redirectUserBasedOnTheSelectedTabOption(tabOptionId);
  }

  const redirectUserBasedOnTheSelectedTabOption = (tabOptionId: string) => {
    switch (tabOptionId) {
      case "profile": router.push(ROUTES.ADMINISTRATION.SETTINGS.PROFILE); return;
      case "change-password": router.push(ROUTES.ADMINISTRATION.SETTINGS.CHANGE_PASSWORD); return;
    }
  }

  return (
    <DashboardLayout>
      <Text
        fontWeight={FontWeights.BOLD}
        useCase={UseCases.HEADER}
        textColor={TextColors.BLACK}
        className="text-2xl pl-2 mb-5"
      >
        Settings
      </Text>

      <SettingsTabOptionsContainer>
        {settingsTabOptions.map((tabOption: SettingsTabOption, index: number) => (
          <SettingsTabOption
            id={tabOption.id}
            text={tabOption.text}
            selected={selectedTabOptionId === tabOption.id}
            onSelect={handleSelect}
          />
        ))}
      </SettingsTabOptionsContainer>

      <div id="selectedTabContent">
        {children}
      </div>
    </DashboardLayout>
  )
}

interface SettingsTabOptionsContainerProps {
  children: React.ReactNode;
}

const SettingsTabOptionsContainer = ({ children }: SettingsTabOptionsContainerProps) => {
  return (
    <div
      id="settings-tab-options-header"
      className="flex border-b-1 border-b-gray-400/50 box-border"
    >
      {children}
    </div>
  )
}

interface SettingsTabOptionProps {
  id: string;
  text: string;
  selected: boolean;
  onSelect: (t: string) => void;
}

const SettingsTabOption = ({ id, text, selected, onSelect }: SettingsTabOptionProps) => {
  return (
    <div className="relative">
      <div
        className={`settings-tab-option mx-3 pb-2 cursor-pointer ${!selected && 'opacity-45'} hover:opacity-100`}
        onClick={() => onSelect(id)}
      >
        <Text
          fontWeight={FontWeights.BOLD}
          textColor={!selected ? TextColors.BLACK : TextColors.PURPLE_VARIANT_3}
          useCase={UseCases.BODY}
        >
          {text}
        </Text>
      </div>
      <div className={`relative top-0.5 left-0 ${selected && 'border-b-2 border-b-kahoot-purple-variant-3 box-border'}`} />
    </div>
  )
}

export default UserSettingsLayout;
