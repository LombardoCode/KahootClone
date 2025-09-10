import React from "react";

interface DashboardOutletContainerProps {
  children: React.ReactNode;
}

const DashboardOutletContainer = ({ children }: DashboardOutletContainerProps) => {
  return (
    <div className="relative flex justify-center px-8 py-8 bg-zinc-200 h-full">
      <div className="w-[1670px]">
        {children}
      </div>
    </div>
  )
}

export default DashboardOutletContainer;
