import { Button } from "@/components/ui/button";
import { Menu, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Page } from "../App";

interface NavbarProps {
  setPage?: (p: Page) => void;
  currentPage?: Page;
}

const scrollLinks = [
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ setPage, currentPage = "home" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (currentPage !== "home") {
      setPage?.("home");
      // After navigating home, scroll after brief delay
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleHomeClick = () => {
    setMobileOpen(false);
    setPage?.("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAboutClick = () => {
    setMobileOpen(false);
    setPage?.("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinkStyle = (active: boolean) => ({
    color: active ? "oklch(0.88 0.16 200)" : undefined,
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "oklch(0.10 0.03 260 / 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
          borderBottom: scrolled
            ? "1px solid oklch(0.88 0.16 200 / 0.15)"
            : "1px solid transparent",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <Star
              className="w-6 h-6 transition-transform duration-300 group-hover:rotate-45"
              strokeWidth={1.5}
              style={{
                color: "oklch(0.88 0.16 200)",
                fill: "oklch(0.88 0.16 200)",
              }}
            />
            <span
              className="font-display text-xl font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              Star Pools
            </span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {/* Home link */}
            <li>
              <button
                type="button"
                data-ocid="nav.link"
                onClick={handleHomeClick}
                className="text-sm tracking-wider transition-colors duration-200 font-medium uppercase"
                style={navLinkStyle(currentPage === "home")}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.88 0.16 200)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    currentPage === "home" ? "oklch(0.88 0.16 200)" : "";
                }}
              >
                Home
              </button>
            </li>
            {/* Scroll links — only meaningful on home page */}
            {scrollLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-ocid="nav.link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-sm tracking-wider text-foreground/80 transition-colors duration-200 font-medium uppercase"
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
            {/* About Us */}
            <li>
              <button
                type="button"
                data-ocid="nav.link"
                onClick={handleAboutClick}
                className="text-sm tracking-wider transition-colors duration-200 font-medium uppercase"
                style={navLinkStyle(currentPage === "about")}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.88 0.16 200)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    currentPage === "about" ? "oklch(0.88 0.16 200)" : "";
                }}
              >
                About Us
              </button>
            </li>
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              data-ocid="nav.primary_button"
              onClick={() => handleNavClick("#contact")}
              className="hidden lg:flex font-semibold transition-all duration-200 uppercase tracking-wider text-xs px-6"
              style={{
                background: "oklch(0.88 0.16 200)",
                color: "oklch(0.08 0.025 264)",
                boxShadow: "0 0 12px oklch(0.88 0.16 200 / 0.25)",
              }}
            >
              Get a Quote
            </Button>

            <button
              type="button"
              className="lg:hidden p-2 text-foreground/80 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.88 0.16 200)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "";
              }}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: "oklch(0.05 0.015 264 / 0.85)" }}
              onClick={() => setMobileOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
              role="button"
              tabIndex={0}
              aria-label="Close menu"
            />
            {/* Drawer */}
            <motion.nav
              className="absolute top-0 right-0 h-full w-72 glass-strong flex flex-col pt-24 pb-8 px-8 gap-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                data-ocid="nav.link"
                onClick={handleHomeClick}
                className="text-lg font-display text-foreground/90 transition-colors border-b border-border/30 pb-4 text-left"
                style={navLinkStyle(currentPage === "home")}
              >
                Home
              </button>
              {scrollLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="nav.link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-lg font-display text-foreground/90 transition-colors border-b border-border/30 pb-4"
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
              ))}
              <button
                type="button"
                data-ocid="nav.link"
                onClick={handleAboutClick}
                className="text-lg font-display text-foreground/90 transition-colors border-b border-border/30 pb-4 text-left"
                style={navLinkStyle(currentPage === "about")}
              >
                About Us
              </button>

              <Button
                type="button"
                data-ocid="nav.primary_button"
                onClick={() => handleNavClick("#contact")}
                className="mt-4 font-semibold uppercase tracking-wider"
                style={{
                  background: "oklch(0.88 0.16 200)",
                  color: "oklch(0.08 0.025 264)",
                }}
              >
                Get a Quote
              </Button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
