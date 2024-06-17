import React from "react";

interface DashboardOutletContainerProps {
  children: React.ReactNode;
}

const DashboardOutletContainer = ({ children }: DashboardOutletContainerProps) => {
  return (
    <div className="px-3 py-4 bg-zinc-200 h-full">
      {children}
    </div>
  )
}

export default DashboardOutletContainer;
