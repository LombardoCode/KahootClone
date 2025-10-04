interface DiscoverFeaturedWrapperProps {
  children: React.ReactNode;
}

const DiscoverFeaturedWrapper = ({ children }: DiscoverFeaturedWrapperProps) => {
  return (
    <div className={`grid grid-flow-col grid-rows-9 xl:grid-rows-6 2xl:grid-rows-3 auto-cols-fr gap-x-2 gap-y-4 mt-2 mb-8`}>
      {children}
    </div>
  )
}

export default DiscoverFeaturedWrapper;
