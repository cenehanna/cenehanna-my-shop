import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "solid",
  shape = "rounded",
  type = "button",
  className = "",
  onClick,
  as: Component = "button",
  ...props
}) => {
  const combinedClassName = [
    styles.button,
    styles[shape],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (Component === "button") {
    return (
      <button
        type={type}
        className={combinedClassName}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <Component className={combinedClassName} onClick={onClick} {...props}>
      {children}
    </Component>
  );
};

export default Button;
