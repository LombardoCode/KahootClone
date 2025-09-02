interface DiscoverCategoryWrapperProps {
  children: React.ReactNode;
}

const DiscoverCategoryWrapper = ({ children }: DiscoverCategoryWrapperProps) => {
  return (
    <div className={`grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-2 mb-8`}>
      {children}
    </div>
  )
}

export default DiscoverCategoryWrapper;
