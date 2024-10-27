interface IconForKahootAnswerProps {
  index: number;
  size: number;
  className?: string;
}

const IconForKahootAnswer = ({ index, size, className }: IconForKahootAnswerProps) => {
  return (
    <div className={`shape-icon-answer flex items-center px-2 rounded-md ${className}`}>
      {index === 0 && (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <path d="M24 22h-24l12-20z" fill="white" />
        </svg>
      )}

      {index === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" fill="white" />
        </svg>
      )}

      {index === 2 && (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="white" />
        </svg>
      )}

      {index === 3 && (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" fill="white" />
        </svg>
      )}
    </div>
  )
}

export default IconForKahootAnswer;
