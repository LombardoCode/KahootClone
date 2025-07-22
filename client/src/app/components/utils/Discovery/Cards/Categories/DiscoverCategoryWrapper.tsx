interface DiscoverCategoryWrapperProps {
  children: React.ReactNode;
}

const DiscoverCategoryWrapper = ({ children }: DiscoverCategoryWrapperProps) => {
  return (
    <div className={`grid grid-cols-6 gap-4 mt-2 mb-8`}>
      {children}
    </div>
  )
}

export default DiscoverCategoryWrapper;
