interface RadioButtonProps {
  name: string;
  id: string;
  size: RadioButtonSize;
  checked?: boolean;
  className?: string;
}

export enum RadioButtonSize {
  MEDIUM = "w-6 h-6"
}

const RadioButton = ({ id, name, size, checked = false, className = "" }: RadioButtonProps) => {
  return (
    <input
      type="radio"
      id={id}
      name={name}
      checked={checked}
      onChange={() => {}}
      className={`outline-none ${size} ${className}`}
    />
  )
}

export default RadioButton;
