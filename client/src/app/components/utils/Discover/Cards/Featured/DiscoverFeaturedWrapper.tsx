interface DiscoverFeaturedWrapperProps {
  children: React.ReactNode;
}

const DiscoverFeaturedWrapper = ({ children }: DiscoverFeaturedWrapperProps) => {
  return (
    <div className={`grid 2xl:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 gap-4 mt-2 mb-8`}>
      {children}
    </div>
  )
}

export default DiscoverFeaturedWrapper;
