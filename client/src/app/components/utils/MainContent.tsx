interface MainContentProps {
  children: React.ReactNode;
  topSpacing?: boolean;
  className?: string;
}

const MainContent = ({ children, topSpacing = true, className }: MainContentProps) => {
  return (
    <div className={`${topSpacing === true ? 'pt-14' : ''} ${className}`}>
      { children }
    </div>
  )
}

export default MainContent;
