import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import Text from "../../UIComponents/Text";

interface SidebarTabProps {
  text: string;
  onHover?: () => void;
  onClick: () => void;
  selected?: boolean;
  icon?: React.ReactNode;
}

const SidebarTab = ({ text, onHover, onClick, selected = false, icon }: SidebarTabProps) => {
  return (
    <div
      className={`layout-option flex items-center px-3 py-3 cursor-pointer ${selected ? 'bg-slate-400/60' : 'hover:bg-slate-300'}`}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {icon ? (
        <div className="ml-2 mr-6">
          {icon}
        </div>
      ) : null}
      <Text
        fontWeight={FontWeights.BOLD}
        textColor={TextColors.BLACK}
        useCase={UseCases.LONGTEXT}
        className="text-base"
      >
        {text}
      </Text>
    </div>
  )
}

export default SidebarTab;
