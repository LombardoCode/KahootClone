interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="container mx-auto">
      { children }
    </div>
  )
}

export default Container;
