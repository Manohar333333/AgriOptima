import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  as = "button",
  href,
  onClick,
  type = "button",
  icon: Icon,
  ...rest
}) {
  const className = `btn btn--${variant}`;
  const content = (
    <>
      <span>{children}</span>
      {Icon && <Icon size={17} strokeWidth={2} aria-hidden="true" />}
    </>
  );

  if (as === "a") {
    return (
      <a className={className} href={href} onClick={onClick} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
