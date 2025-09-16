interface CheckBoxProps {
  id: string;
  name: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const CheckBox = ({
  id = "",
  name = "",
  className = "",
  onChange,
  checked
}: CheckBoxProps) => {
  return (
    <input
      type="checkbox"
      name={name}
      id={id}
      className={`outline-none w-5 h-5 rounded-full ${className}`}
      onChange={onChange}
      checked={checked}
    />
  )
}

export default CheckBox;
