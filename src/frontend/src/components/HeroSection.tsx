import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-pool.dim_1920x1080.jpg')",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.025 264 / 0.92) 0%, oklch(0.10 0.03 260 / 0.80) 50%, oklch(0.08 0.025 264 / 0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-block text-xs tracking-[0.35em] uppercase mb-6 font-semibold"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            ✦ Premium Pool Construction ✦
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-foreground">Luxury Pools,</span>
          <br />
          <span className="italic" style={{ color: "oklch(0.88 0.16 200)" }}>
            Crafted for You
          </span>
        </motion.h1>

        <motion.p
          className="text-foreground/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Star Pools designs and builds world-class swimming pools across
          Maharashtra, India. Where every drop of water tells a story of
          excellence.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            data-ocid="hero.primary_button"
            size="lg"
            onClick={() => onScrollTo("gallery")}
            className="font-semibold tracking-wider uppercase text-sm px-8 py-6 transition-all duration-200"
            style={{
              background: "oklch(0.88 0.16 200)",
              color: "oklch(0.08 0.025 264)",
              boxShadow: "0 0 20px oklch(0.88 0.16 200 / 0.35)",
            }}
          >
            Explore Our Work
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            size="lg"
            variant="outline"
            onClick={() => onScrollTo("contact")}
            className="font-semibold tracking-wider uppercase text-sm px-8 py-6 transition-all duration-200 bg-transparent"
            style={{
              borderColor: "oklch(0.88 0.16 200 / 0.5)",
              color: "oklch(0.88 0.16 200)",
            }}
          >
            Get a Quote
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => onScrollTo("services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs tracking-widest text-foreground/50 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            ease: "easeInOut",
          }}
        >
          <ChevronDown
            className="w-5 h-5"
            style={{ color: "oklch(0.88 0.16 200 / 0.7)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
