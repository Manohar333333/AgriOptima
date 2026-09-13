import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import Button from "./Button";
import "./Navbar.css";

const LINKS = [
  { href: "#why", label: "Why AgriOptima" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#model-insights", label: "AI Insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand">
          <Sprout size={20} strokeWidth={2} aria-hidden="true" />
          <span>AgriOptima</span>
        </a>
        <nav className="navbar__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <Button variant="primary" as="a" href="#farm-analysis">
          Analyze Your Farm
        </Button>
      </div>
    </header>
  );
}
