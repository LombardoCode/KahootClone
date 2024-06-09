interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  return (
    <div className="pt-14">
      { children }
    </div>
  )
}

export default MainContent;
