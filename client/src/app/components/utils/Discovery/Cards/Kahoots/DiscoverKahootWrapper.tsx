interface DiscoverKahootWrapperProps {
  children: React.ReactNode;
}

const DiscoverKahootWrapper = ({ children }: DiscoverKahootWrapperProps) => {
  return (
    <div className={`grid grid-cols-7 gap-4 mt-2 mb-8`}>
      {children}
    </div>
  )
}

export default DiscoverKahootWrapper;
