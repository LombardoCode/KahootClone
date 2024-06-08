interface ButtonProps {
  textContent: string;
  backgroundColor: BackgroundColors;
  className?: string;
};

export enum BackgroundColors {
  GRAY = 'bg-gray-700 hover:bg-gray-800'
}

const Button = ({ textContent, backgroundColor, className }: ButtonProps) => {
  return (
    <button
      className={`text-white py-3 border-b-4 border-b-gray-800 rounded-md hover:border-b-2 hover: ${backgroundColor} ${className}`}>
      {textContent}
    </button>
  )
}

export default Button;
