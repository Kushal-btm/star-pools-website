import {
  CalendarCheck,
  Filter,
  Hammer,
  Home,
  Layers,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Hammer,
    title: "Swimming Pool Construction",
    description:
      "From concept to completion, we build bespoke swimming pools tailored to your vision. Our expert team uses premium materials and modern construction techniques to deliver pools that combine beauty, durability, and lasting performance.",
    accentColor: "cyan",
  },
  {
    icon: CalendarCheck,
    title: "Swimming Pool AMC",
    description:
      "Our Annual Maintenance Contracts keep your pool in pristine condition year-round. Regular scheduled servicing, chemical balancing, equipment checks, and priority support — complete peace of mind for pool owners.",
    accentColor: "aqua",
  },
  {
    icon: Wrench,
    title: "Repair & Maintenance",
    description:
      "Fast, reliable repair solutions for all types of pool issues — leaks, tile damage, pump failures, and more. Our skilled technicians diagnose and fix problems efficiently to minimize downtime and restore your pool quickly.",
    accentColor: "cyan",
  },
  {
    icon: Filter,
    title: "Filtration Systems",
    description:
      "We design, supply, and install advanced pool filtration systems that keep water crystal clear and hygienic. From sand filters to cartridge systems, we provide solutions suited for every pool size and usage requirement.",
    accentColor: "aqua",
  },
  {
    icon: Layers,
    title: "Readymade & Polymer Pools",
    description:
      "Choose from pre-fabricated readymade pools for quick installation or premium polymer pools offering superior durability, corrosion resistance, and a smooth finish — both ideal for residential and commercial applications.",
    accentColor: "cyan",
  },
  {
    icon: Home,
    title: "Indoor Pool Construction",
    description:
      "Transform any indoor space into a year-round aquatic retreat. We specialize in designing and building climate-controlled indoor swimming pools for homes, hotels, and fitness centers — with full ventilation and safety planning.",
    accentColor: "aqua",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
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

// cyan: oklch(0.88 0.16 200)  — #00E5FF
// aqua: oklch(0.83 0.13 205)  — #22D3EE
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

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.03 260) 0%, oklch(0.14 0.035 255) 100%)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.16 200 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            What We Do
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.88 0.16 200)" }}
          />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            const accent = ACCENT[service.accentColor as keyof typeof ACCENT];
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group glass rounded-xl p-8 flex flex-col gap-5 cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{
                  boxShadow: `0 0 0 1px ${accent.base.replace(")", " / 0.1)")}`,
                }}
                whileHover={{
                  boxShadow: `0 0 25px ${accent.hover}, 0 0 0 1px ${accent.border}`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    background: accent.dim,
                    border: `1px solid ${accent.border}`,
                  }}
                >
                  <Icon
                    className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: accent.base }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div
                  className="mt-auto h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: accent.base }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
