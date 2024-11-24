"use client";

import { motion } from "framer-motion";

const SpinnerGachapon = () => {
  return (
    <motion.div
      className="flex w-16 h-16 rounded-full overflow-hidden"
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
