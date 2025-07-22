import React from "react";

interface DashboardOutletContainerProps {
  children: React.ReactNode;
}

const DashboardOutletContainer = ({ children }: DashboardOutletContainerProps) => {
  return (
    <div className="px-8 py-8 bg-zinc-200 h-full">
      {children}
    </div>
  )
}

export default DashboardOutletContainer;
