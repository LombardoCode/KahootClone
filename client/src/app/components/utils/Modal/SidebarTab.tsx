import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "../../UIComponents/Text";

interface SidebarTabProps {
  text: string;
  onHover?: () => void;
  onClick: () => void;
  selected?: boolean;
}

const SidebarTab = ({ text, onHover, onClick, selected = false }: SidebarTabProps) => {
  return (
    <div
      className={`layout-option flex items-center px-3 py-3 cursor-pointer ${selected ? 'bg-slate-400/60' : 'hover:bg-slate-300'}`}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faGamepad} className={`${TextColors.GRAY} mr-2`} />
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
