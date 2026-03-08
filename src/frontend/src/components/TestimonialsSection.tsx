import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllTestimonials } from "@/hooks/useQueries";
import { MessageSquare, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Testimonial } from "../backend.d";

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: 1n,
    customerName: "Rajesh Patil",
    location: "Pune, Maharashtra",
    rating: 5n,
    message:
      "Star Pools transformed our backyard into a true paradise. The infinity pool they built exceeded every expectation — the craftsmanship is extraordinary and the team was professional throughout.",
    featured: true,
  },
  {
    id: 2n,
    customerName: "Sunita Deshmukh",
    location: "Nashik, Maharashtra",
    rating: 5n,
    message:
      "The lighting system they designed makes our pool magical at night. Every guest comments on it. The project was delivered on time and on budget — a rare combination in this industry.",
    featured: true,
  },
  {
    id: 3n,
    customerName: "Amit Shinde",
    location: "Aurangabad, Maharashtra",
    rating: 5n,
    message:
      "We hired Star Pools for a full renovation and couldn't be happier. They brought our 15-year-old pool back to life with stunning mosaic tiles and a completely upgraded filtration system.",
    featured: false,
  },
];

// Gold color kept intentionally for star ratings — warm contrast on testimonials
const STAR_GOLD = "oklch(0.78 0.14 85)";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= rating ? STAR_GOLD : "none"}
          stroke={star <= rating ? STAR_GOLD : "oklch(0.4 0.04 255)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const rating = Number(testimonial.rating);

  return (
    <motion.div
      className="glass rounded-xl p-8 flex flex-col gap-5 h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        boxShadow:
          "0 0 25px oklch(0.88 0.16 200 / 0.12), 0 0 0 1px oklch(0.88 0.16 200 / 0.2)",
      }}
    >
      {/* Quote mark */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "oklch(0.88 0.16 200 / 0.1)",
          border: "1px solid oklch(0.88 0.16 200 / 0.2)",
        }}
      >
        <MessageSquare
          className="w-5 h-5"
          strokeWidth={1.5}
          style={{ color: "oklch(0.88 0.16 200)" }}
        />
      </div>

      {/* Stars — intentionally gold for warmth */}
      <StarRating rating={rating} />

      {/* Quote */}
      <p className="text-foreground/85 text-sm leading-relaxed flex-1 font-light italic">
        "{testimonial.message}"
      </p>

      {/* Author */}
      <div className="border-t border-border/30 pt-5">
        <p className="font-display font-semibold text-foreground">
          {testimonial.customerName}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {testimonial.location}
        </p>
      </div>
    </motion.div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["t1", "t2", "t3"].map((key) => (
        <div key={key} className="glass rounded-xl p-8 space-y-4">
          <Skeleton
            className="w-10 h-10 rounded-lg"
            style={{ background: "oklch(0.21 0.04 255)" }}
          />
          <Skeleton
            className="w-24 h-4 rounded"
            style={{ background: "oklch(0.21 0.04 255)" }}
          />
          <Skeleton
            className="w-full h-20 rounded"
            style={{ background: "oklch(0.21 0.04 255)" }}
          />
          <Skeleton
            className="w-32 h-4 rounded"
            style={{ background: "oklch(0.21 0.04 255)" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useGetAllTestimonials();

  const displayTestimonials =
    !testimonials || testimonials.length === 0
      ? PLACEHOLDER_TESTIMONIALS
      : testimonials;

  return (
    <section
      id="testimonials"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.035 255) 0%, oklch(0.10 0.03 260) 100%)",
      }}
    >
      {/* Decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.88 0.16 200 / 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section label — keeping gold for warmth contrast in testimonials */}
          <span
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
            style={{ color: STAR_GOLD }}
          >
            Client Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: STAR_GOLD }}
          />
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div data-ocid="testimonials.loading_state">
            <TestimonialsSkeleton />
          </div>
        ) : displayTestimonials.length === 0 ? (
          <motion.div
            data-ocid="testimonials.empty_state"
            className="text-center py-20 glass rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Star
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
              strokeWidth={1}
            />
            <p className="text-muted-foreground font-display text-lg">
              Client testimonials coming soon
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial, i) => (
              <TestimonialCard
                key={String(testimonial.id)}
                testimonial={testimonial}
                index={i}
              />
            ))}
          </div>
        )}

        {(!testimonials || testimonials.length === 0) && !isLoading && (
          <motion.p
            className="text-center text-sm text-muted-foreground/60 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            * Showcasing sample testimonials — real reviews will appear here
            soon
          </motion.p>
        )}
      </div>
    </section>
  );
}
