/**
 * Purpose:
 * This component will serve as a CSS grid container to wrap all
 * the Kahoot answers tiles.
 */

interface KahootAnswerGridWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const KahootAnswerGridWrapper = ({ children = <></>, className = '' }: KahootAnswerGridWrapperProps) => {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-3 ${className}`}>
      { children }
    </div>
  )
}

export default KahootAnswerGridWrapper;
