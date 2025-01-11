"use client";

import { motion } from "framer-motion";
import { SpinnerSizes } from "../Spinner.interface";

interface SpinnerHalfDonutProps {
  size: SpinnerSizes;
}

const SpinnerHalfDonut = ({ size = SpinnerSizes.MEDIUM }: SpinnerHalfDonutProps) => {
  return (
    <motion.div
      className="relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{
        rotate: 0,
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 0.65,
        repeat: Infinity,
        repeatDelay: 0.35,
        ease: "easeInOut",
      }}
    >
      <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
        <div
          className="absolute rounded-full border-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderWidth: `${size / 5}px`
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default SpinnerHalfDonut;
