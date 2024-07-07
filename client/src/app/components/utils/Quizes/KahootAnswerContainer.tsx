interface KahootAnswerContainerProps {
  children: React.ReactNode;
  className?: string;
}

const KahootAnswerContainer = ({ children = <></>, className = '' }: KahootAnswerContainerProps) => {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-3 ${className}`}>
      { children }
    </div>
  )
}

export default KahootAnswerContainer;
