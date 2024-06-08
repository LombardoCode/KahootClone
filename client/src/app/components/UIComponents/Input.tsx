interface InputProps {
  placeholder: string;
};

const Input = ({ placeholder }: InputProps) => {
  return (
    <input
      className="uicomponent-input bg-black border-2 border-gray-800 rounded-sm text-gray-400 font-bold text-center py-2 placeholder-gray-700 focus:border-gray-500 outline-none transition-all duration-300"
      type="text"
      placeholder={placeholder}
    />
  )
}

export default Input;
