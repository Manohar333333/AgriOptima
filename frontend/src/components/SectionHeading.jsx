export default function SectionHeading({ tag, title, subtitle, align = "left" }) {
  return (
    <div style={{ textAlign: align }}>
      {tag && <span className="section-tag">{tag}</span>}
      <h2 className="section-heading" style={align === "center" ? { marginInline: "auto" } : undefined}>
        {title}
      </h2>
      {subtitle && (
        <p className="section-sub" style={align === "center" ? { marginInline: "auto" } : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
