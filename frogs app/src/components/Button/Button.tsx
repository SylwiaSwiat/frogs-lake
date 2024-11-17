import "./Button.scss";

type ButtonProps = {
  title: string;
  handleClick: () => void;
  disabled?: boolean;
};

const Button = ({ title, handleClick, disabled }: ButtonProps) => {
  return (
    <>
      <button onClick={handleClick} className={`${disabled ? "disabled" : ""}`}>
        {title}
      </button>
    </>
  );
};

export default Button;
