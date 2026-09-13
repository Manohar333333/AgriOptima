import "./GlassPanel.css";

export default function GlassPanel({ children, className = "", as: Tag = "div", ...rest }) {
  return (
    <Tag className={`glass-panel ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
