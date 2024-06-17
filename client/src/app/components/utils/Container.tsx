interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={`container mx-auto ${className}`}>
      { children }
    </div>
  )
}

export default Container;
