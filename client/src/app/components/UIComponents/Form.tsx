interface FormProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  onSubmit: () => void;
}

const Form = ({ id = "", className = "", children, onSubmit }: FormProps) => {
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  }

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.nativeEvent as any).isComposing) {
      return;
    }

    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      const tag = target.tagName;

      if (tag === "TEXTAREA") {
        return;
      }

      e.preventDefault();
      onSubmit?.();
    }
  }

  return (
    <form
      id={id}
      className={className}
      onSubmit={handleOnSubmit}
      onKeyDown={onKeyDownHandler}
    >
      {children}
    </form>
  )
}

export default Form;
