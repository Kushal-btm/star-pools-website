import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllProjects } from "@/hooks/useQueries";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Category } from "../backend.d";
import type { Project } from "../backend.d";

const CATEGORY_LABELS: Record<Category | "all", string> = {
  all: "All",
  construction: "Construction",
  renovation: "Renovation",
  maintenance: "Maintenance",
  lighting: "Lighting",
};

const CATEGORY_COLORS: Record<Category, string> = {
  construction: "oklch(0.88 0.16 200)" /* #00E5FF — cyan */,
  renovation: "oklch(0.83 0.13 205)" /* #22D3EE — aqua */,
  maintenance: "oklch(0.78 0.12 215)" /* #38BDF8 — blue-cyan */,
  lighting: "oklch(0.83 0.13 205)" /* #22D3EE — aqua */,
};

// Placeholder data when backend returns empty
const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: 1n,
    title: "Pune Hilltop Infinity Pool",
    description:
      "A stunning 20m infinity pool with panoramic views of the Sahyadri hills, white marble coping, and full underwater LED lighting system built for a private villa in Pune. Completed construction from groundwork to finishing.",
    imageUrl: "/assets/generated/project-construction-1.dim_800x600.jpg",
    category: Category.construction,
    featured: true,
    photos: ["/assets/generated/project-construction-1.dim_800x600.jpg"],
  },
  {
    id: 2n,
    title: "Nashik Vineyard Pool — AMC",
    description:
      "Ongoing Annual Maintenance Contract for a luxury vineyard estate in Nashik. Regular chemical balancing, equipment servicing, filter cleaning, and seasonal readiness checks ensure the pool stays in pristine condition year-round.",
    imageUrl: "/assets/generated/project-lighting-1.dim_800x600.jpg",
    category: Category.maintenance,
    featured: true,
    photos: ["/assets/generated/project-lighting-1.dim_800x600.jpg"],
  },
  {
    id: 3n,
    title: "Aurangabad Heritage Pool Renovation",
    description:
      "A full repair and renovation of a classic pool at a heritage bungalow in Aurangabad — new Italian marble tiles, mosaic accents, upgraded pump system, leak repairs, and a reimagined pool deck.",
    imageUrl: "/assets/generated/project-renovation-1.dim_800x600.jpg",
    category: Category.renovation,
    featured: false,
    photos: ["/assets/generated/project-renovation-1.dim_800x600.jpg"],
  },
];

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const cat = project.category as Category;
  const ocidIndex = index + 1;
  const color = CATEGORY_COLORS[cat];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      data-ocid={`gallery.item.${ocidIndex}`}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      style={{ border: "1px solid oklch(0.31 0.045 255)" }}
    >
      {/* Image */}
      <div
        className="aspect-[4/3] overflow-hidden bg-navy-mid flex items-center justify-center"
        style={{ background: "oklch(0.14 0.03 258)" }}
      >
        {imgError || !project.imageUrl ? (
          <div
            className="flex flex-col items-center justify-center w-full h-full gap-3"
            style={{ background: "oklch(0.14 0.03 258)" }}
          >
            <ImageOff
              className="w-10 h-10"
              style={{ color: "oklch(0.55 0.12 205)" }}
              strokeWidth={1.5}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "oklch(0.55 0.12 205)" }}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.08 0.025 264 / 0.92) 0%, transparent 60%)",
        }}
      >
        <Badge
          className="w-fit text-xs mb-2 font-semibold uppercase tracking-wider"
          style={{
            background: `${color.replace(")", " / 0.13)")}`,
            color: color,
            border: `1px solid ${color.replace(")", " / 0.4)")}`,
          }}
        >
          {CATEGORY_LABELS[cat]}
        </Badge>
        <h3 className="font-display text-lg font-semibold text-foreground">
          {project.title}
        </h3>
      </div>

      {/* Always-visible badge */}
      <div className="absolute top-4 left-4">
        <Badge
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            background: "oklch(0.08 0.025 264 / 0.8)",
            color: color,
            border: `1px solid ${color.replace(")", " / 0.4)")}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {CATEGORY_LABELS[cat]}
        </Badge>
      </div>
    </motion.div>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {["s1", "s2", "s3", "s4", "s5", "s6"].map((key) => (
        <div key={key} className="rounded-xl overflow-hidden">
          <Skeleton
            className="aspect-[4/3] w-full"
            style={{ background: "oklch(0.21 0.04 255)" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function GallerySection() {
  const { data: projects, isLoading } = useGetAllProjects();
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalImgError, setModalImgError] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const displayProjects =
    !projects || projects.length === 0 ? PLACEHOLDER_PROJECTS : projects;

  // Reset modal image error + photo index when project changes
  const handleSelectProject = (project: Project | null) => {
    setModalImgError(false);
    setPhotoIndex(0);
    setSelectedProject(project);
  };

  // Get all photos for the selected project (fall back to imageUrl if photos array is empty)
  const modalPhotos = selectedProject
    ? selectedProject.photos && selectedProject.photos.length > 0
      ? selectedProject.photos
      : selectedProject.imageUrl
        ? [selectedProject.imageUrl]
        : []
    : [];

  const currentPhoto = modalPhotos[photoIndex] ?? "";

  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + modalPhotos.length) % modalPhotos.length);
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % modalPhotos.length);

  const filtered =
    activeFilter === "all"
      ? displayProjects
      : displayProjects.filter((p) => p.category === activeFilter);

  const filters: Array<Category | "all"> = [
    "all",
    Category.construction,
    Category.renovation,
    Category.maintenance,
    Category.lighting,
  ];

  return (
    <section
      id="gallery"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "oklch(0.10 0.03 260)" }}
    >
      {/* Decorative corner glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, oklch(0.88 0.16 200 / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block"
            style={{ color: "oklch(0.83 0.13 205)" }}
          >
            Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Projects
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.83 0.13 205)" }}
          />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              data-ocid="gallery.tab"
              onClick={() => setActiveFilter(filter)}
              className="px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-200"
              style={{
                background:
                  activeFilter === filter
                    ? "oklch(0.83 0.13 205)"
                    : "oklch(0.14 0.03 258 / 0.7)",
                color:
                  activeFilter === filter
                    ? "oklch(0.08 0.025 264)"
                    : "oklch(0.67 0.04 255)",
                border:
                  activeFilter === filter
                    ? "1px solid transparent"
                    : "1px solid oklch(0.31 0.045 255)",
              }}
            >
              {CATEGORY_LABELS[filter]}
            </button>
          ))}
        </motion.div>

        {/* Projects grid or skeleton */}
        {isLoading ? (
          <div data-ocid="gallery.loading_state">
            <GallerySkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            data-ocid="gallery.empty_state"
            className="text-center py-24 glass rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ImageOff
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
              strokeWidth={1}
            />
            <p className="text-muted-foreground text-lg font-display">
              No projects in this category yet
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Check back soon for updates
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={String(project.id)}
                  project={project}
                  index={i}
                  onClick={() => handleSelectProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Note for placeholder */}
        {(!projects || projects.length === 0) && !isLoading && (
          <motion.p
            className="text-center text-sm text-muted-foreground/60 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            * Showcasing sample projects — real projects will appear here soon
          </motion.p>
        )}
      </div>

      {/* Project detail modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && handleSelectProject(null)}
      >
        <DialogContent
          data-ocid="gallery.dialog"
          className="max-w-3xl w-full p-0 overflow-hidden border-border"
          style={{ background: "oklch(0.14 0.03 258)" }}
        >
          {selectedProject && (
            <>
              {/* Photo slideshow */}
              <div
                className="relative aspect-video w-full overflow-hidden flex items-center justify-center"
                style={{ background: "oklch(0.10 0.03 260)" }}
              >
                {modalImgError || modalPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                    <ImageOff
                      className="w-12 h-12"
                      style={{ color: "oklch(0.55 0.12 205)" }}
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "oklch(0.55 0.12 205)" }}
                    >
                      No image available
                    </span>
                  </div>
                ) : (
                  <img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt={`${selectedProject.title} (${photoIndex + 1} of ${modalPhotos.length})`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={() => setModalImgError(true)}
                  />
                )}

                {/* Prev / Next arrows — only when there are multiple photos */}
                {modalPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      data-ocid="gallery.modal"
                      onClick={prevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: "oklch(0.08 0.025 264 / 0.75)",
                        border: "1px solid oklch(0.88 0.16 200 / 0.2)",
                        color: "oklch(0.88 0.16 200)",
                        backdropFilter: "blur(6px)",
                      }}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      data-ocid="gallery.modal"
                      onClick={nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: "oklch(0.08 0.025 264 / 0.75)",
                        border: "1px solid oklch(0.88 0.16 200 / 0.2)",
                        color: "oklch(0.88 0.16 200)",
                        backdropFilter: "blur(6px)",
                      }}
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {modalPhotos.map((url, i) => (
                        <button
                          key={url || `dot-${i}`}
                          type="button"
                          onClick={() => setPhotoIndex(i)}
                          className="w-2 h-2 rounded-full transition-all"
                          style={{
                            background:
                              i === photoIndex
                                ? "oklch(0.88 0.16 200)"
                                : "oklch(0.88 0.16 200 / 0.35)",
                            transform:
                              i === photoIndex ? "scale(1.25)" : "scale(1)",
                          }}
                          aria-label={`Go to photo ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Counter badge */}
                    <span
                      className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: "oklch(0.08 0.025 264 / 0.75)",
                        color: "oklch(0.88 0.16 200)",
                        border: "1px solid oklch(0.88 0.16 200 / 0.2)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {photoIndex + 1} / {modalPhotos.length}
                    </span>
                  </>
                )}
              </div>

              <div className="p-8">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <Badge
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: "oklch(0.88 0.16 200 / 0.15)",
                        color: "oklch(0.88 0.16 200)",
                        border: "1px solid oklch(0.88 0.16 200 / 0.3)",
                      }}
                    >
                      {CATEGORY_LABELS[selectedProject.category as Category]}
                    </Badge>
                  </div>
                  <DialogTitle className="font-display text-2xl text-foreground">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground leading-relaxed mt-3">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>
                <button
                  type="button"
                  data-ocid="gallery.close_button"
                  onClick={() => handleSelectProject(null)}
                  className="mt-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.88 0.16 200)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
