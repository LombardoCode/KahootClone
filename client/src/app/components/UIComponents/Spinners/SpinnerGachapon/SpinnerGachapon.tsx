"use client";

import { motion } from "framer-motion";
import { SpinnerSizes } from "../Spinner.interface";

interface SpinnerGachaponProps {
  size: SpinnerSizes;
}

const SpinnerGachapon = ({ size = SpinnerSizes.MEDIUM }: SpinnerGachaponProps) => {
  return (
    <motion.div
      className="flex rounded-full overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      initial={{
        rotate: 0
      }}
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 0.65,
        repeat: Infinity,
        repeatDelay: 0.35,
        ease: "easeInOut",
      }}
    >
      <div className="spinner-gachapon-left-side bg-white w-1/2 h-full"></div>
      <div className="spinner-gachapon-left-side bg-white/55 w-1/2 h-full"></div>
    </motion.div>
  )
}

export default SpinnerGachapon;
