import { motion } from "framer-motion"

interface ModalBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalBackdrop = ({ isOpen, onClose }: ModalBackdropProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 0.7 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 bg-black"
    />
  )
}

export default ModalBackdrop;
