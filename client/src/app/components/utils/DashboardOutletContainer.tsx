import React from "react";

interface DashboardOutletContainerProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardOutletContainer = ({ children, className = "" }: DashboardOutletContainerProps) => {
  return (
    <div className={`relative flex justify-center px-8 py-8 bg-red-200 h-full ${className}`}>
      <div className="bg-cyan-300 w-full 2xl:w-[1670px]">
        {children}
      </div>
    </div>
  )
}

export default DashboardOutletContainer;
