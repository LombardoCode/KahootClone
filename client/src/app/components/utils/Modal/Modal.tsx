import { motion } from "framer-motion"
import Text from "../../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import ModalBackdrop from "./ModalBackdrop";
import Button from "../../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ModalProps {
  modalType: ModalTypes;
  title?: string;
  bodyContent: React.ReactNode;
  footerContent: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export enum ModalTypes {
  INPUT,
  DELETION
}

const Modal = ({ modalType, title = "", isOpen, onClose, bodyContent, footerContent, className = "" }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  let btnBackgroundColor: BackgroundColors;
  let textColor: TextColors;
  switch (modalType) {
    case ModalTypes.INPUT:
      btnBackgroundColor = BackgroundColors.GREEN;
      textColor = TextColors.WHITE;
      break;
    case ModalTypes.DELETION:
      btnBackgroundColor = BackgroundColors.RED;
      textColor = TextColors.WHITE;
      break
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <ModalBackdrop isOpen={isOpen} onClose={onClose} />
      <div
        className="flex items-center justify-center z-20"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: 'circOut' }}
          className={`bg-white p-6 rounded-lg shadow-lg max-h-[calc(100vh-100px)] overflow-hidden flex flex-col ${className}`}
        >
          {/* Title */}
          {title !== null && title !== undefined && title !== ''
            ? (
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.BLACK}
                useCase={UseCases.HEADER}
                className="text-2xl mb-4"
              >
                {title}
              </Text>
            ) : null}

          {/* Body */}
          <div className="modal-content flex-1 overflow-y-auto max-h-[calc(100vh-220px)] ">
            {bodyContent}
          </div>

          {/* Footer */}
          <div
            id="modal-buttons-footer"
            className="flex justify-end mt-3"
          >
            {footerContent}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Modal;
