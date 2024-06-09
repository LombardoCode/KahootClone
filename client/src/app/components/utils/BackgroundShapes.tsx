interface BackgroundShapesProps {
  className?: string;
  shapeColor?: ShapeColor
}

export enum ShapeColor {
  VIOLET = "bg-violet-900",
  GRAY = "bg-gray-700"
}

const BackgroundShapes = ({ className, shapeColor = ShapeColor.GRAY }: BackgroundShapesProps) => {
  return (
    <div className={`background-shapes absolute w-full h-screen overflow-hidden ${className}`}>
      <div className={`absolute background-shape-square w-96 h-96 rotate-45 scale-200 opacity-15 ${shapeColor}`}></div>
      <div className={`absolute background-shape-circle w-96 h-96 right-0 top-full -translate-y-96 scale-200 opacity-15 rounded-full ${shapeColor}`}></div>
    </div>
  )
}

export default BackgroundShapes;
