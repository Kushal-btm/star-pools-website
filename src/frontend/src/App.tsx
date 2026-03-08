import { Toaster } from "@/components/ui/sonner";
import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import AboutUsPage from "./components/AboutUsPage";
import AdminPage from "./components/AdminPage";
import HomePage from "./components/HomePage";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";

export type Page = "home" | "about" | "admin";

function FloatingContactButtons() {
  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-3 z-50"
      aria-label="Quick contact"
    >
      {/* Call button */}
      <a
        href="tel:+917405225299"
        data-ocid="floating.call_button"
        aria-label="Call Star Pools"
        className="group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
        style={{
          background: "oklch(0.55 0.17 250)",
          boxShadow: "0 4px 20px oklch(0.55 0.17 250 / 0.45)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 6px 28px oklch(0.55 0.17 250 / 0.65)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 20px oklch(0.55 0.17 250 / 0.45)";
        }}
      >
        <Phone className="w-6 h-6 text-white" strokeWidth={2} />
      </a>

      {/* WhatsApp button */}
      <a
        href="https://wa.me/917405225299"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="floating.whatsapp_button"
        aria-label="Chat on WhatsApp"
        className="group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
        style={{
          background: "oklch(0.56 0.18 145)",
          boxShadow: "0 4px 20px oklch(0.56 0.18 145 / 0.45)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 6px 28px oklch(0.56 0.18 145 / 0.65)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 20px oklch(0.56 0.18 145 / 0.45)";
        }}
      >
        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
      </a>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  // Secret URL hash routing: navigating to /#admin opens admin login
  useEffect(() => {
    if (window.location.hash === "#admin") {
      setPage("admin");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <InternetIdentityProvider>
      {page === "home" ? (
        <HomePage setPage={setPage} />
      ) : page === "about" ? (
        <AboutUsPage setPage={setPage} />
      ) : (
        <AdminPage setPage={setPage} />
      )}
      {page !== "admin" && <FloatingContactButtons />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.03 258)",
            border: "1px solid oklch(0.88 0.16 200 / 0.4)",
            color: "oklch(1 0 0)",
          },
        }}
      />
    </InternetIdentityProvider>
  );
}
