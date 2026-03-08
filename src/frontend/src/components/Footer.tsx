import { Star } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

type Page = "home" | "about" | "admin";

interface FooterProps {
  setPage?: (p: Page) => void;
}

const scrollLinks = [
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: SiInstagram, href: "#", label: "Instagram" },
  { icon: SiFacebook, href: "#", label: "Facebook" },
  { icon: SiX, href: "#", label: "X (Twitter)" },
];

export default function Footer({ setPage }: FooterProps) {
  const year = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleHomeClick = () => {
    setPage?.("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAboutClick = () => {
    setPage?.("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "oklch(0.08 0.025 264)",
        borderTop: "1px solid oklch(0.31 0.045 255 / 0.5)",
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.88 0.16 200 / 0.6) 30%, oklch(0.83 0.13 205 / 0.6) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleHomeClick}
              className="flex items-center gap-2.5"
              data-ocid="footer.link"
            >
              <Star
                className="w-5 h-5"
                strokeWidth={1.5}
                style={{
                  color: "oklch(0.88 0.16 200)",
                  fill: "oklch(0.88 0.16 200)",
                }}
              />
              <span
                className="font-display text-lg font-bold tracking-widest uppercase"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Star Pools
              </span>
            </button>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Designing and building premium swimming pools across Pune and
              Maharashtra. Excellence in every project since 2003.
            </p>
            {/* Socials */}
            <div className="flex gap-3 pt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-ocid="footer.link"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.14 0.03 258)",
                    border: "1px solid oklch(0.31 0.045 255)",
                    color: "oklch(0.52 0.04 255)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(0.88 0.16 200 / 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.52 0.04 255)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(0.31 0.045 255)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground/90 uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  onClick={handleHomeClick}
                  className="text-sm text-muted-foreground transition-colors text-left"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  Home
                </button>
              </li>
              {scrollLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid="footer.link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-sm text-muted-foreground transition-colors"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.88 0.16 200)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  onClick={handleAboutClick}
                  className="text-sm text-muted-foreground transition-colors text-left"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground/90 uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="tel:+917405225299"
                  className="transition-colors"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  +91 7405225299
                </a>
              </li>
              <li>
                <a
                  href="mailto:starpools.23@gmail.com"
                  className="transition-colors"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  starpools.23@gmail.com
                </a>
              </li>
              <li>Dhayari, Pune, Maharashtra, India</li>
              <li className="text-muted-foreground/60">
                Mon – Sat: 9am – 9pm IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground"
          style={{ borderTop: "1px solid oklch(0.21 0.04 255)" }}
        >
          <p>© {year} Star Pools. All rights reserved.</p>
          <p>
            Built with <span style={{ color: "oklch(0.88 0.16 200)" }}>♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "oklch(0.88 0.16 200 / 0.8)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.88 0.16 200)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.88 0.16 200 / 0.8)";
              }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
