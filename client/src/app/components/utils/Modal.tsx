import { motion } from "framer-motion"
import Text from "../UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import ModalBackdrop from "./Modal/ModalBackdrop";
import Button from "../UIComponents/Button";
import { BackgroundColors } from "@/app/interfaces/Colors.interface";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;

  confirmText?: string | null;
  onConfirm?: (x?: any) => void;
}

const Modal = ({ title, isOpen, onClose, content, confirmText = null, onConfirm }: ModalProps) => {
  if (!isOpen) {
    return null;
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
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <Text
            fontWeight={FontWeights.BOLD}
            textColor={TextColors.BLACK}
            useCase={UseCases.HEADER}
            className="text-2xl mb-4"
          >
            {title}
          </Text>
          <div className="modal-content">
            {content}
          </div>
          <div
            id="modal-buttons-footer"
            className="flex justify-end mt-3"
          >
            <Button
              backgroundColor={BackgroundColors.GRAY}
              fontWeight={FontWeights.BOLD}
              className="mr-2"
              onClick={onClose}
            >
              Close
            </Button>

            {confirmText !== null && (
              <Button
                backgroundColor={BackgroundColors.GREEN}
                fontWeight={FontWeights.BOLD}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Modal;
