const BackgroundShapes = () => {
  return (
    <div className="background-shapes absolute w-full h-screen overflow-hidden -z-10">
      <div className="absolute background-shape-square w-96 h-96 bg-violet-900 rotate-45 scale-200 opacity-15"></div>
      <div className="absolute background-shape-circle w-96 h-96 bg-violet-900 right-0 top-full -translate-y-96 scale-200 opacity-15 rounded-full"></div>
    </div>
  )
}

export default BackgroundShapes;
