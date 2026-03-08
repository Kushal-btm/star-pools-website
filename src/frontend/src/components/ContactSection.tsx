import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactForm } from "@/hooks/useQueries";
import {
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: submitForm, isPending } = useSubmitContactForm();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});

    submitForm(form, {
      onSuccess: () => {
        toast.success("Message sent! We'll be in touch soon.", {
          duration: 5000,
        });
        setForm({ name: "", email: "", phone: "", message: "" });
      },
      onError: () => {
        toast.error(
          "Failed to send message. Please try again or contact us directly.",
        );
      },
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 7405225299",
      href: "tel:+917405225299",
    },
    {
      icon: Mail,
      label: "Email",
      value: "starpools.23@gmail.com",
      href: "mailto:starpools.23@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dhayari, Pune, Maharashtra, India",
      href: "#",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "oklch(0.10 0.03 260)" }}
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 100%, oklch(0.88 0.16 200 / 0.05) 0%, transparent 60%)",
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
          <span
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
            style={{ color: "oklch(0.83 0.13 205)" }}
          >
            Reach Out
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.83 0.13 205)" }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Contact info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Let's Build Something Beautiful
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Ready to bring your dream pool to life? Our team of expert
                designers and builders is here to turn your vision into reality.
                Reach out today for a free consultation.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: "oklch(0.88 0.16 200 / 0.1)",
                      border: "1px solid oklch(0.88 0.16 200 / 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 12px oklch(0.88 0.16 200 / 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "";
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={1.5}
                      style={{ color: "oklch(0.88 0.16 200)" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p
                      className="text-foreground/90 font-medium transition-colors"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "oklch(0.88 0.16 200)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "";
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917405225299"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.primary_button"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto font-semibold tracking-wider uppercase text-sm px-8 py-6 transition-all duration-200"
                style={{
                  background: "oklch(0.56 0.18 145)",
                  color: "#fff",
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Chat on WhatsApp
              </Button>
            </a>

            {/* Decorative divider line */}
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.88 0.16 200 / 0.5) 0%, transparent 100%)",
              }}
            />

            <p className="text-muted-foreground/60 text-sm">
              Response within 24 hours. Available Monday – Saturday, 9am – 9pm
              IST.
            </p>
          </motion.div>

          {/* Right — Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-xl p-8 space-y-6"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-name"
                  className="text-foreground/80 text-sm uppercase tracking-wider"
                >
                  Full Name *
                </Label>
                <Input
                  id="contact-name"
                  data-ocid="contact.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Rajesh Patil"
                  className="bg-navy-light/30 border-border/50 transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-0"
                  style={
                    {
                      "--tw-ring-color": "oklch(0.88 0.16 200)",
                    } as React.CSSProperties
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.88 0.16 200)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
                {errors.name && (
                  <p
                    data-ocid="contact.error_state"
                    className="text-sm text-destructive"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-email"
                  className="text-foreground/80 text-sm uppercase tracking-wider"
                >
                  Email Address *
                </Label>
                <Input
                  id="contact-email"
                  data-ocid="contact.input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="rajesh@example.com"
                  className="bg-navy-light/30 border-border/50 transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-0"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.88 0.16 200)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
                {errors.email && (
                  <p
                    data-ocid="contact.error_state"
                    className="text-sm text-destructive"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-phone"
                  className="text-foreground/80 text-sm uppercase tracking-wider"
                >
                  Phone Number
                </Label>
                <Input
                  id="contact-phone"
                  data-ocid="contact.input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+91 74052 25299"
                  className="bg-navy-light/30 border-border/50 transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-0"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.88 0.16 200)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-message"
                  className="text-foreground/80 text-sm uppercase tracking-wider"
                >
                  Message *
                </Label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.textarea"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Tell us about your dream pool..."
                  rows={5}
                  className="bg-navy-light/30 border-border/50 transition-colors placeholder:text-muted-foreground/50 resize-none focus-visible:ring-0"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.88 0.16 200)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
                {errors.message && (
                  <p
                    data-ocid="contact.error_state"
                    className="text-sm text-destructive"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                data-ocid="contact.submit_button"
                disabled={isPending}
                size="lg"
                className="w-full font-semibold uppercase tracking-wider text-sm py-6 transition-all duration-200"
                style={{
                  background: "oklch(0.88 0.16 200)",
                  color: "oklch(0.08 0.025 264)",
                  boxShadow: isPending
                    ? "none"
                    : "0 0 20px oklch(0.88 0.16 200 / 0.3)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
