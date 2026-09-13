import { Mail, Github, Linkedin, Phone } from "lucide-react";
import "./Footer.css";

const CREDIT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:maradanamanohar333@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Manohar333333",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/maradana-manohar-532845300?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="#top" className="footer__brand">
          <img src="/AgriOptima.png" alt="" width="18" height="18" aria-hidden="true" />
          <span>AgriOptima</span>
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a href="#why">Why AgriOptima</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#farm-analysis">Farm Analysis</a>
          <a href="#model-insights">AI Insights</a>
        </nav>
        <p className="footer__note">
          Crop recommendations are decision support, not a substitute for
          agronomic advice.
        </p>
      </div>

      <hr className="hairline footer__divider" />

      <div className="container footer__credit">
        <p className="footer__copyright">
          &copy; {year} AgriOptima. All rights reserved.
        </p>

        <div className="footer__developer">
          <span className="footer__developer-label">Designed &amp; developed by Maradana Manohar</span>
          <a className="footer__developer-phone" href="tel:+918977230089">
            <Phone size={14} strokeWidth={2} aria-hidden="true" />
            +91 89772 30089
          </a>
          <div className="footer__developer-social" aria-label="Developer social links">
            {CREDIT_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="footer__social-icon"
                title={label}
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
