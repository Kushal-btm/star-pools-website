import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Filter,
  Hammer,
  Home,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type Page = "home" | "about" | "admin";

interface AboutUsPageProps {
  setPage?: (p: Page) => void;
}

const services = [
  { icon: Hammer, title: "Swimming Pool Construction", accentColor: "cyan" },
  {
    icon: CalendarCheck,
    title: "Swimming Pool AMC (Annual Maintenance Contracts)",
    accentColor: "aqua",
  },
  {
    icon: Wrench,
    title: "Swimming Pool Repair & Maintenance",
    accentColor: "cyan",
  },
  {
    icon: Filter,
    title: "Swimming Pool Filtration Systems",
    accentColor: "aqua",
  },
  {
    icon: Layers,
    title: "Readymade & Polymer Pool Construction",
    accentColor: "cyan",
  },
  {
    icon: Home,
    title: "Indoor Swimming Pool Construction",
    accentColor: "aqua",
  },
];

const ACCENT = {
  cyan: {
    base: "oklch(0.88 0.16 200)",
    dim: "oklch(0.88 0.16 200 / 0.12)",
    border: "oklch(0.88 0.16 200 / 0.25)",
    hover: "oklch(0.88 0.16 200 / 0.2)",
  },
  aqua: {
    base: "oklch(0.83 0.13 205)",
    dim: "oklch(0.83 0.13 205 / 0.12)",
    border: "oklch(0.83 0.13 205 / 0.25)",
    hover: "oklch(0.83 0.13 205 / 0.2)",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function AboutUsPage({ setPage }: AboutUsPageProps) {
  return (
    <div className="min-h-screen bg-background" data-ocid="about.page">
      <Navbar setPage={setPage} currentPage="about" />

      {/* Page Hero */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.08 0.025 264) 0%, oklch(0.10 0.03 260) 100%)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.88 0.16 200 / 0.07) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp}>
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
              style={{ color: "oklch(0.83 0.13 205)" }}
            >
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              About{" "}
              <span
                className="relative inline-block"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Star Pools
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.88 0.16 200 / 0.6), oklch(0.83 0.13 205 / 0.6))",
                  }}
                />
              </span>
            </h1>
            <p
              className="text-lg md:text-xl font-medium tracking-wide mt-6"
              style={{ color: "oklch(0.52 0.04 255)" }}
            >
              Established 2003 &nbsp;·&nbsp; Dhayari, Pune &nbsp;·&nbsp;
              Maharashtra, India
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.10 0.03 260)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <motion.div {...fadeUp}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Two Decades of{" "}
                <span style={{ color: "oklch(0.88 0.16 200)" }}>
                  Excellence
                </span>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Established in 2003, Star Pools is a trusted name in swimming
                  pool construction and maintenance in Pune. Located in Dhayari,
                  the company has built a strong reputation for delivering
                  high-quality swimming pool solutions for residential,
                  commercial, and institutional clients.
                </p>
                <p>
                  With more than two decades of experience, Star Pools has
                  become a one-stop destination for complete swimming pool
                  services. The company focuses on customer satisfaction,
                  quality workmanship, and reliable service, which has helped
                  build long-term relationships with clients across Pune.
                </p>
              </div>
            </motion.div>

            {/* Right: stats */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                {
                  value: "20+",
                  label: "Years Experience",
                  accentColor: "cyan",
                },
                {
                  value: "500+",
                  label: "Projects Completed",
                  accentColor: "aqua",
                },
                {
                  value: "100%",
                  label: "Client Satisfaction",
                  accentColor: "cyan",
                },
              ].map(({ value, label, accentColor }) => {
                const accent = ACCENT[accentColor as keyof typeof ACCENT];
                return (
                  <div
                    key={label}
                    className="glass rounded-xl px-8 py-6 flex items-center gap-6"
                    style={{
                      border: `1px solid ${accent.border}`,
                      background: "oklch(0.14 0.03 258)",
                    }}
                  >
                    <span
                      className="font-display text-5xl font-bold"
                      style={{ color: accent.base }}
                    >
                      {value}
                    </span>
                    <span className="text-foreground/80 font-medium text-lg">
                      {label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.08 0.025 264)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center space-y-8" {...fadeUp}>
            <div>
              <span
                className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
                style={{ color: "oklch(0.83 0.13 205)" }}
              >
                Our Values
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Commitment
              </h2>
              <div
                className="w-16 h-0.5 mx-auto mt-4"
                style={{ background: "oklch(0.83 0.13 205)" }}
              />
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our team of skilled professionals is dedicated to designing,
              building, and maintaining swimming pools that combine modern
              technology, durability, and elegant design. Every project is
              handled with attention to detail to ensure the highest standards
              of quality and safety.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              As the company continues to grow, Star Pools aims to expand its
              services and reach a wider customer base, while maintaining the
              same commitment to excellence that has defined the brand since its
              beginning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Services */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.10 0.03 260) 0%, oklch(0.14 0.035 255) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              What We Offer
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <div
              className="w-16 h-0.5 mx-auto mt-4"
              style={{ background: "oklch(0.88 0.16 200)" }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const accent = ACCENT[service.accentColor as keyof typeof ACCENT];
              return (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                  data-ocid={`about.services.item.${index + 1}`}
                  className="group glass rounded-xl p-7 flex items-start gap-5 cursor-default transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: `1px solid ${accent.border.replace("0.25)", "0.15)")}`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 20px ${accent.hover}, 0 0 0 1px ${accent.border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: accent.dim,
                      border: `1px solid ${accent.border}`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: accent.base }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground leading-snug pt-1">
                    {service.title}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Location & Contact */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "oklch(0.10 0.03 260)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <span
              className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
              style={{ color: "oklch(0.83 0.13 205)" }}
            >
              Find Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Location &amp; Contact
            </h2>
            <div
              className="w-16 h-0.5 mx-auto mt-4"
              style={{ background: "oklch(0.83 0.13 205)" }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location Card */}
            <motion.div
              className="glass rounded-2xl p-8 space-y-5"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                border: "1px solid oklch(0.88 0.16 200 / 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.88 0.16 200 / 0.12)",
                    border: "1px solid oklch(0.88 0.16 200 / 0.25)",
                  }}
                >
                  <MapPin
                    className="w-5 h-5"
                    strokeWidth={1.5}
                    style={{ color: "oklch(0.88 0.16 200)" }}
                  />
                </div>
                <h3
                  className="font-display text-2xl font-bold"
                  style={{ color: "oklch(0.88 0.16 200)" }}
                >
                  Find Us
                </h3>
              </div>

              <div className="space-y-1 text-muted-foreground leading-relaxed">
                <p className="text-foreground/90 font-semibold text-lg">
                  Star Pools
                </p>
                <p>5/18, Opp Nalanda High School,</p>
                <p>Near Dhareshwar Temple,</p>
                <p>Benkar Vasti Road, Dhayari-411041,</p>
                <p>Pune, Maharashtra</p>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.52 0.04 255)" }}
              >
                Conveniently located near Dhareshwar Temple, Dhayari, making us
                easily accessible for clients across Pune.
              </p>

              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.88 0.16 200 / 0.4) 0%, transparent 100%)",
                }}
              />
              <p className="text-sm" style={{ color: "oklch(0.52 0.04 255)" }}>
                Mon – Sat: 9am – 9pm IST
              </p>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              className="glass rounded-2xl p-8 space-y-5"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                border: "1px solid oklch(0.83 0.13 205 / 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.83 0.13 205 / 0.12)",
                    border: "1px solid oklch(0.83 0.13 205 / 0.25)",
                  }}
                >
                  <Phone
                    className="w-5 h-5"
                    strokeWidth={1.5}
                    style={{ color: "oklch(0.83 0.13 205)" }}
                  />
                </div>
                <h3
                  className="font-display text-2xl font-bold"
                  style={{ color: "oklch(0.83 0.13 205)" }}
                >
                  Contact Us
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.52 0.04 255)" }}
                  >
                    Contact Person
                  </p>
                  <p className="text-foreground/90 font-semibold">
                    Anil Haribhau Dhimdhime{" "}
                    <span
                      className="text-sm font-normal"
                      style={{ color: "oklch(0.52 0.04 255)" }}
                    >
                      (Owner)
                    </span>
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.52 0.04 255)" }}
                  >
                    Phone
                  </p>
                  <a
                    href="tel:+917405225299"
                    className="text-foreground/90 font-semibold transition-colors flex items-center gap-2"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.83 0.13 205)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "";
                    }}
                  >
                    <Phone
                      className="w-4 h-4"
                      strokeWidth={1.5}
                      style={{ color: "oklch(0.83 0.13 205)" }}
                    />
                    +91 7405225299
                  </a>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.52 0.04 255)" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:starpools.23@gmail.com"
                    className="text-foreground/90 font-semibold transition-colors flex items-center gap-2 break-all"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.83 0.13 205)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "";
                    }}
                  >
                    <Mail
                      className="w-4 h-4 flex-shrink-0"
                      strokeWidth={1.5}
                      style={{ color: "oklch(0.83 0.13 205)" }}
                    />
                    starpools.23@gmail.com
                  </a>
                </div>
              </div>

              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.83 0.13 205 / 0.4) 0%, transparent 100%)",
                }}
              />

              <a
                href="https://wa.me/917405225299"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="about.contact.button"
              >
                <Button
                  size="lg"
                  className="w-full font-semibold tracking-wider uppercase text-sm py-6 transition-all duration-200"
                  style={{
                    background: "oklch(0.56 0.18 145)",
                    color: "#fff",
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}
