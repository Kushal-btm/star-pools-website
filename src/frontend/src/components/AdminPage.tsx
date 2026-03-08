import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Edit,
  FileText,
  Fingerprint,
  ImagePlus,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Shield,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Category, type Project, type Testimonial } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useAdminActor } from "../hooks/useAdminActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { uploadImageBytes } from "../hooks/usePhotoUpload";

type AdminPage = "home" | "about" | "admin";

interface AdminPageProps {
  setPage: (p: AdminPage) => void;
}

// ─── Photo Upload Types ───────────────────────────────────────────────────────

interface UploadingPhoto {
  id: string;
  file: File;
  progress: number;
  url?: string;
  error?: string;
  preview: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useAllProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAllTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAllContactForms() {
  const { adminActor, adminSecret, isInitializing } = useAdminActor();
  return useQuery({
    queryKey: ["contactForms"],
    queryFn: async () => {
      if (!adminActor) return [];
      return adminActor.adminGetAllContactForms(adminSecret);
    },
    enabled: !!adminActor && !isInitializing,
  });
}

// ─── Photo Upload Hook ────────────────────────────────────────────────────────

// Resize + compress an image File to a max dimension and quality using canvas
async function compressImage(
  file: File,
  maxDimension = 800,
  quality = 0.7,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob failed"));
            return;
          }
          blob
            .arrayBuffer()
            .then((buf) => resolve(new Uint8Array(buf as ArrayBuffer)))
            .catch(reject);
        },
        "image/jpeg",
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };
    img.src = objectUrl;
  });
}

function usePhotoUploader() {
  const [uploading, setUploading] = useState<UploadingPhoto[]>([]);

  const uploadFiles = useCallback(async (files: FileList) => {
    const newItems: UploadingPhoto[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      preview: URL.createObjectURL(file),
    }));
    setUploading((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      try {
        // Compress before uploading to avoid memory crashes with large photos
        const bytes = await compressImage(item.file);
        // Upload to canister blob storage to get a permanent URL
        const url = await uploadImageBytes(bytes, (pct: number) => {
          setUploading((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, progress: Math.round(pct * 100) } : p,
            ),
          );
        });
        setUploading((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, url, progress: 100 } : p,
          ),
        );
      } catch {
        setUploading((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, error: "Upload failed" } : p,
          ),
        );
      }
    }
  }, []);

  const removePhoto = useCallback((id: string) => {
    setUploading((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const reset = useCallback(() => {
    setUploading((prev) => {
      for (const p of prev) {
        if (p.preview) URL.revokeObjectURL(p.preview);
      }
      return [];
    });
  }, []);

  const uploadedUrls = uploading.filter((p) => p.url).map((p) => p.url!);
  const isUploading = uploading.some((p) => !p.url && !p.error);

  return {
    uploading,
    uploadFiles,
    removePhoto,
    reset,
    uploadedUrls,
    isUploading,
  };
}

// ─── Category Helpers ─────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  [Category.construction]: "Construction",
  [Category.lighting]: "Lighting",
  [Category.maintenance]: "Maintenance",
  [Category.renovation]: "Renovation",
};

const CATEGORY_OPTIONS = [
  { value: Category.construction, label: "Construction" },
  { value: Category.lighting, label: "Lighting" },
  { value: Category.maintenance, label: "Maintenance" },
  { value: Category.renovation, label: "Renovation" },
];

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className="flex gap-1 border-0 p-0 m-0">
      <legend className="sr-only">Rating</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className="w-6 h-6"
            fill={n <= value ? "oklch(0.78 0.14 85)" : "transparent"}
            stroke={n <= value ? "oklch(0.78 0.14 85)" : "oklch(0.52 0.04 255)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </fieldset>
  );
}

// ─── Photo Upload Grid ────────────────────────────────────────────────────────

function PhotoUploadGrid({
  uploading,
  existingUrls,
  onUpload,
  onRemoveUploading,
  onRemoveExisting,
  isUploading,
}: {
  uploading: UploadingPhoto[];
  existingUrls: string[];
  onUpload: (files: FileList) => void;
  onRemoveUploading: (id: string) => void;
  onRemoveExisting: (url: string) => void;
  isUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label
          className="text-sm font-medium"
          style={{ color: "oklch(0.88 0.16 200)" }}
        >
          Photos
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-ocid="project.upload_button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-2 border-cyan/30 hover:border-cyan/60 text-xs"
          style={{ color: "oklch(0.88 0.16 200)" }}
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ImagePlus className="w-3.5 h-3.5" />
          )}
          {isUploading ? "Uploading..." : "Add Photos"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onUpload(e.target.files)}
          data-ocid="project.dropzone"
        />
      </div>

      {(existingUrls.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((url, i) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  data-ocid="project.delete_button"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "oklch(0.62 0.22 25 / 0.9)" }}
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              {i === 0 && (
                <span
                  className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded font-semibold"
                  style={{
                    background: "oklch(0.88 0.16 200 / 0.9)",
                    color: "oklch(0.08 0.025 264)",
                  }}
                >
                  Cover
                </span>
              )}
            </div>
          ))}

          {uploading.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={item.preview}
                alt="Uploading..."
                className="w-full h-full object-cover"
                style={{ opacity: item.url ? 1 : 0.5 }}
              />
              {!item.url && !item.error && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                  style={{ background: "oklch(0.08 0.025 264 / 0.7)" }}
                >
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{ color: "oklch(0.88 0.16 200)" }}
                  />
                  <Progress value={item.progress} className="w-16 h-1" />
                </div>
              )}
              {item.error && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "oklch(0.62 0.22 25 / 0.6)" }}
                >
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              )}
              {item.url && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemoveUploading(item.id)}
                    data-ocid="project.delete_button"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "oklch(0.62 0.22 25 / 0.9)" }}
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {existingUrls.length === 0 && uploading.length === 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="project.dropzone"
          className="w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors"
          style={{
            borderColor: "oklch(0.88 0.16 200 / 0.2)",
            color: "oklch(0.52 0.04 255)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "oklch(0.88 0.16 200 / 0.5)";
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.88 0.16 200)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "oklch(0.88 0.16 200 / 0.2)";
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.52 0.04 255)";
          }}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Click to upload photos</p>
          <p className="text-xs mt-1 opacity-60">
            PNG, JPG, WEBP supported • Multiple files OK
          </p>
        </button>
      )}
    </div>
  );
}

// ─── Project Form Modal ───────────────────────────────────────────────────────

interface ProjectFormData {
  title: string;
  description: string;
  category: Category;
  featured: boolean;
  existingPhotos: string[];
}

function ProjectFormModal({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project?: Project;
}) {
  const { adminActor, adminSecret } = useAdminActor();
  const queryClient = useQueryClient();
  const isEdit = !!project;

  const [form, setForm] = useState<ProjectFormData>(() => ({
    title: project?.title ?? "",
    description: project?.description ?? "",
    category: project?.category ?? Category.construction,
    featured: project?.featured ?? false,
    existingPhotos:
      project?.photos ?? (project?.imageUrl ? [project.imageUrl] : []),
  }));

  const {
    uploading,
    uploadFiles,
    removePhoto,
    reset,
    uploadedUrls,
    isUploading,
  } = usePhotoUploader();

  const allPhotos = [...form.existingPhotos, ...uploadedUrls];
  const coverImageUrl = allPhotos[0] ?? "";

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!adminActor) throw new Error("Admin actor not ready");
      await adminActor.adminCreateProject(
        adminSecret,
        form.title,
        form.description,
        form.category,
        coverImageUrl,
        form.featured,
        allPhotos,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      handleClose();
    },
    onError: (err) =>
      toast.error(
        `Failed to create project: ${err instanceof Error ? err.message : String(err)}`,
      ),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!adminActor || !project) throw new Error("Admin actor not ready");
      await adminActor.adminUpdateProject(
        adminSecret,
        project.id,
        form.title,
        form.description,
        form.category,
        coverImageUrl,
        form.featured,
        allPhotos,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      handleClose();
    },
    onError: (err) =>
      toast.error(
        `Failed to update project: ${err instanceof Error ? err.message : String(err)}`,
      ),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "oklch(0.10 0.03 260)",
          border: "1px solid oklch(0.88 0.16 200 / 0.2)",
        }}
        data-ocid="project.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="text-xl font-display"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            {isEdit ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.52 0.04 255)" }}>
            {isEdit
              ? "Update project details and photos"
              : "Fill in the details to add a new project"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="proj-title"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              Title *
            </Label>
            <Input
              id="proj-title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. Pune Infinity Pool"
              data-ocid="project.input"
              style={{
                background: "oklch(0.14 0.03 258)",
                borderColor: "oklch(0.88 0.16 200 / 0.2)",
                color: "oklch(1 0 0)",
              }}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="proj-desc"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              Description
            </Label>
            <Textarea
              id="proj-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe this project..."
              rows={3}
              data-ocid="project.textarea"
              style={{
                background: "oklch(0.14 0.03 258)",
                borderColor: "oklch(0.88 0.16 200 / 0.2)",
                color: "oklch(1 0 0)",
                resize: "vertical",
              }}
            />
          </div>

          {/* Category + Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="proj-cat"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as Category }))
                }
              >
                <SelectTrigger
                  id="proj-cat"
                  data-ocid="project.select"
                  style={{
                    background: "oklch(0.14 0.03 258)",
                    borderColor: "oklch(0.88 0.16 200 / 0.2)",
                    color: "oklch(1 0 0)",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.14 0.03 258)",
                    borderColor: "oklch(0.88 0.16 200 / 0.2)",
                  }}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      style={{ color: "oklch(1 0 0)" }}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label style={{ color: "oklch(0.88 0.16 200)" }}>Featured</Label>
              <div className="flex items-center gap-3 h-10">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, featured: v }))
                  }
                  data-ocid="project.switch"
                />
                <span
                  className="text-sm"
                  style={{
                    color: form.featured
                      ? "oklch(0.88 0.16 200)"
                      : "oklch(0.52 0.04 255)",
                  }}
                >
                  {form.featured ? "Featured" : "Not featured"}
                </span>
              </div>
            </div>
          </div>

          {/* Photos */}
          <PhotoUploadGrid
            uploading={uploading}
            existingUrls={form.existingPhotos}
            onUpload={uploadFiles}
            onRemoveUploading={removePhoto}
            onRemoveExisting={(url) =>
              setForm((p) => ({
                ...p,
                existingPhotos: p.existingPhotos.filter((u) => u !== url),
              }))
            }
            isUploading={isUploading}
          />

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              data-ocid="project.cancel_button"
              style={{
                borderColor: "oklch(0.88 0.16 200 / 0.2)",
                color: "oklch(0.63 0.04 250)",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading}
              data-ocid="project.save_button"
              style={{
                background: "oklch(0.88 0.16 200)",
                color: "oklch(0.08 0.025 264)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Testimonial Form Modal ───────────────────────────────────────────────────

interface TestimonialFormData {
  customerName: string;
  location: string;
  rating: number;
  message: string;
  featured: boolean;
}

function TestimonialFormModal({
  open,
  onClose,
  testimonial,
}: {
  open: boolean;
  onClose: () => void;
  testimonial?: Testimonial;
}) {
  const { adminActor, adminSecret } = useAdminActor();
  const queryClient = useQueryClient();
  const isEdit = !!testimonial;

  const [form, setForm] = useState<TestimonialFormData>(() => ({
    customerName: testimonial?.customerName ?? "",
    location: testimonial?.location ?? "",
    rating: testimonial ? Number(testimonial.rating) : 5,
    message: testimonial?.message ?? "",
    featured: testimonial?.featured ?? false,
  }));

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!adminActor) throw new Error("Admin actor not ready");
      await adminActor.adminCreateTestimonial(
        adminSecret,
        form.customerName,
        form.location,
        BigInt(form.rating),
        form.message,
        form.featured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created successfully");
      onClose();
    },
    onError: (err) =>
      toast.error(
        `Failed to create testimonial: ${err instanceof Error ? err.message : String(err)}`,
      ),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!adminActor || !testimonial) throw new Error("Admin actor not ready");
      await adminActor.adminUpdateTestimonial(
        adminSecret,
        testimonial.id,
        form.customerName,
        form.location,
        BigInt(form.rating),
        form.message,
        form.featured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated successfully");
      onClose();
    },
    onError: (err) =>
      toast.error(
        `Failed to update testimonial: ${err instanceof Error ? err.message : String(err)}`,
      ),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim())
      return toast.error("Customer name is required");
    if (!form.message.trim()) return toast.error("Message is required");
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{
          background: "oklch(0.10 0.03 260)",
          border: "1px solid oklch(0.88 0.16 200 / 0.2)",
        }}
        data-ocid="testimonial.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="text-xl font-display"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            {isEdit ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.52 0.04 255)" }}>
            {isEdit
              ? "Update client testimonial details"
              : "Add a new client testimonial"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="test-name"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Customer Name *
              </Label>
              <Input
                id="test-name"
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                placeholder="e.g. Rajesh Patil"
                data-ocid="testimonial.input"
                style={{
                  background: "oklch(0.14 0.03 258)",
                  borderColor: "oklch(0.88 0.16 200 / 0.2)",
                  color: "oklch(1 0 0)",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="test-loc"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Location
              </Label>
              <Input
                id="test-loc"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="e.g. Pune, Maharashtra"
                data-ocid="testimonial.input"
                style={{
                  background: "oklch(0.14 0.03 258)",
                  borderColor: "oklch(0.88 0.16 200 / 0.2)",
                  color: "oklch(1 0 0)",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "oklch(0.88 0.16 200)" }}>Rating</Label>
            <StarRatingInput
              value={form.rating}
              onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="test-msg" style={{ color: "oklch(0.88 0.16 200)" }}>
              Message *
            </Label>
            <Textarea
              id="test-msg"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="Client's review..."
              rows={4}
              data-ocid="testimonial.textarea"
              style={{
                background: "oklch(0.14 0.03 258)",
                borderColor: "oklch(0.88 0.16 200 / 0.2)",
                color: "oklch(1 0 0)",
                resize: "vertical",
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.featured}
              onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
              data-ocid="testimonial.switch"
            />
            <Label
              style={{
                color: form.featured
                  ? "oklch(0.88 0.16 200)"
                  : "oklch(0.52 0.04 255)",
              }}
            >
              Featured testimonial
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              data-ocid="testimonial.cancel_button"
              style={{
                borderColor: "oklch(0.88 0.16 200 / 0.2)",
                color: "oklch(0.63 0.04 250)",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="testimonial.save_button"
              style={{
                background: "oklch(0.88 0.16 200)",
                color: "oklch(0.08 0.025 264)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: "oklch(0.10 0.03 260)",
          border: "1px solid oklch(0.62 0.22 25 / 0.4)",
        }}
        data-ocid="delete.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle
              className="w-5 h-5"
              style={{ color: "oklch(0.75 0.18 40)" }}
            />
            <span style={{ color: "oklch(1 0 0)" }}>{title}</span>
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.63 0.04 250)" }}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            data-ocid="delete.cancel_button"
            style={{
              borderColor: "oklch(0.88 0.16 200 / 0.2)",
              color: "oklch(0.63 0.04 250)",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="delete.confirm_button"
            style={{ background: "oklch(0.62 0.22 25)", color: "oklch(1 0 0)" }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProjectsTab() {
  const { data: projects = [], isLoading } = useAllProjects();
  const { adminActor, adminSecret } = useAdminActor();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!adminActor) throw new Error("Admin actor not ready");
      await adminActor.adminDeleteProject(adminSecret, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
      setDeleteProject(null);
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Stats + Add button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div
            className="px-4 py-2 rounded-lg"
            style={{ background: "oklch(0.14 0.03 258)" }}
          >
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: "oklch(0.52 0.04 255)" }}
            >
              Total
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              {projects.length}
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-lg"
            style={{ background: "oklch(0.14 0.03 258)" }}
          >
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: "oklch(0.52 0.04 255)" }}
            >
              Featured
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              {featuredCount}
            </p>
          </div>
        </div>

        <Button
          type="button"
          data-ocid="projects.primary_button"
          onClick={() => setAddOpen(true)}
          className="gap-2 font-semibold"
          style={{
            background: "oklch(0.88 0.16 200)",
            color: "oklch(0.08 0.025 264)",
            boxShadow: "0 0 16px oklch(0.88 0.16 200 / 0.3)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="projects.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
        </div>
      ) : projects.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="projects.empty_state"
        >
          <Droplets
            className="w-12 h-12 mx-auto mb-3 opacity-40"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
          <p className="font-medium" style={{ color: "oklch(0.63 0.04 250)" }}>
            No projects yet
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.03 255)" }}>
            Click "Add Project" to get started
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(0.88 0.16 200 / 0.12)" }}
          data-ocid="projects.table"
        >
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "oklch(0.88 0.16 200 / 0.12)" }}>
                <TableHead
                  style={{
                    color: "oklch(0.88 0.16 200)",
                    background: "oklch(0.14 0.03 258)",
                  }}
                >
                  Photo
                </TableHead>
                <TableHead
                  style={{
                    color: "oklch(0.88 0.16 200)",
                    background: "oklch(0.14 0.03 258)",
                  }}
                >
                  Title
                </TableHead>
                <TableHead
                  style={{
                    color: "oklch(0.88 0.16 200)",
                    background: "oklch(0.14 0.03 258)",
                  }}
                >
                  Category
                </TableHead>
                <TableHead
                  style={{
                    color: "oklch(0.88 0.16 200)",
                    background: "oklch(0.14 0.03 258)",
                  }}
                >
                  Status
                </TableHead>
                <TableHead
                  className="text-right"
                  style={{
                    color: "oklch(0.88 0.16 200)",
                    background: "oklch(0.14 0.03 258)",
                  }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, i) => (
                <TableRow
                  key={project.id.toString()}
                  data-ocid={`projects.item.${i + 1}`}
                  style={{
                    borderColor: "oklch(0.88 0.16 200 / 0.08)",
                    background:
                      i % 2 === 0
                        ? "oklch(0.10 0.03 260)"
                        : "oklch(0.12 0.03 259)",
                  }}
                >
                  <TableCell>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        style={{
                          border: "1px solid oklch(0.88 0.16 200 / 0.15)",
                        }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(0.17 0.04 258)" }}
                      >
                        <Droplets
                          className="w-5 h-5 opacity-40"
                          style={{ color: "oklch(0.88 0.16 200)" }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: "oklch(1 0 0)" }}
                      >
                        {project.title}
                      </p>
                      <p
                        className="text-xs mt-0.5 line-clamp-1"
                        style={{ color: "oklch(0.52 0.04 255)" }}
                      >
                        {project.photos.length} photo
                        {project.photos.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{
                        background: "oklch(0.88 0.16 200 / 0.12)",
                        color: "oklch(0.88 0.16 200)",
                      }}
                    >
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Badge
                        style={{
                          background: "oklch(0.88 0.16 200 / 0.15)",
                          color: "oklch(0.88 0.16 200)",
                          border: "1px solid oklch(0.88 0.16 200 / 0.3)",
                        }}
                      >
                        Featured
                      </Badge>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        data-ocid={`projects.edit_button.${i + 1}`}
                        onClick={() => setEditProject(project)}
                        className="gap-1.5 h-8 px-3 text-xs transition-colors"
                        style={{ color: "oklch(0.88 0.16 200)" }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        data-ocid={`projects.delete_button.${i + 1}`}
                        onClick={() => setDeleteProject(project)}
                        className="gap-1.5 h-8 px-3 text-xs transition-colors"
                        style={{ color: "oklch(0.62 0.22 25)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <ProjectFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      {editProject && (
        <ProjectFormModal
          open={!!editProject}
          onClose={() => setEditProject(null)}
          project={editProject}
        />
      )}
      {deleteProject && (
        <DeleteConfirmDialog
          open={!!deleteProject}
          onClose={() => setDeleteProject(null)}
          onConfirm={() => deleteMutation.mutate(deleteProject.id)}
          title="Delete Project?"
          description={`"${deleteProject.title}" will be permanently deleted and cannot be recovered.`}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

function TestimonialsTab() {
  const { data: testimonials = [], isLoading } = useAllTestimonials();
  const { adminActor, adminSecret } = useAdminActor();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!adminActor) throw new Error("Admin actor not ready");
      await adminActor.adminDeleteTestimonial(adminSecret, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted");
      setDeleteItem(null);
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div
          className="px-4 py-2 rounded-lg"
          style={{ background: "oklch(0.14 0.03 258)" }}
        >
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: "oklch(0.52 0.04 255)" }}
          >
            Total Reviews
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            {testimonials.length}
          </p>
        </div>
        <Button
          type="button"
          data-ocid="testimonials.primary_button"
          onClick={() => setAddOpen(true)}
          className="gap-2 font-semibold"
          style={{
            background: "oklch(0.88 0.16 200)",
            color: "oklch(0.08 0.025 264)",
            boxShadow: "0 0 16px oklch(0.88 0.16 200 / 0.3)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="testimonials.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
        </div>
      ) : testimonials.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="testimonials.empty_state"
        >
          <MessageSquare
            className="w-12 h-12 mx-auto mb-3 opacity-40"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
          <p className="font-medium" style={{ color: "oklch(0.63 0.04 250)" }}>
            No testimonials yet
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.03 255)" }}>
            Add client reviews to showcase on your website
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="testimonials.list">
          {testimonials.map((t, i) => (
            <div
              key={t.id.toString()}
              data-ocid={`testimonials.item.${i + 1}`}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                background: "oklch(0.14 0.03 258)",
                border: "1px solid oklch(0.88 0.16 200 / 0.1)",
              }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{
                  background: "oklch(0.88 0.16 200 / 0.15)",
                  color: "oklch(0.88 0.16 200)",
                }}
              >
                {t.customerName.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(1 0 0)" }}
                  >
                    {t.customerName}
                  </p>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.52 0.04 255)" }}
                  >
                    {t.location}
                  </span>
                  {t.featured && (
                    <Badge
                      style={{
                        background: "oklch(0.88 0.16 200 / 0.15)",
                        color: "oklch(0.88 0.16 200)",
                        border: "1px solid oklch(0.88 0.16 200 / 0.3)",
                        fontSize: "10px",
                      }}
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5"
                      fill={
                        star <= Number(t.rating)
                          ? "oklch(0.78 0.14 85)"
                          : "transparent"
                      }
                      stroke={
                        star <= Number(t.rating)
                          ? "oklch(0.78 0.14 85)"
                          : "oklch(0.52 0.04 255)"
                      }
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <p
                  className="text-sm line-clamp-2"
                  style={{ color: "oklch(0.63 0.04 250)" }}
                >
                  {t.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  data-ocid={`testimonials.edit_button.${i + 1}`}
                  onClick={() => setEditItem(t)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: "oklch(0.88 0.16 200 / 0.1)",
                    color: "oklch(0.88 0.16 200)",
                  }}
                  aria-label="Edit testimonial"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  data-ocid={`testimonials.delete_button.${i + 1}`}
                  onClick={() => setDeleteItem(t)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: "oklch(0.62 0.22 25 / 0.1)",
                    color: "oklch(0.62 0.22 25)",
                  }}
                  aria-label="Delete testimonial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      {editItem && (
        <TestimonialFormModal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          testimonial={editItem}
        />
      )}
      {deleteItem && (
        <DeleteConfirmDialog
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => deleteMutation.mutate(deleteItem.id)}
          title="Delete Testimonial?"
          description={`Review by "${deleteItem.customerName}" will be permanently deleted.`}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Inquiries Tab ────────────────────────────────────────────────────────────

function InquiriesTab() {
  const { data: forms = [], isLoading } = useAllContactForms();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div
          className="px-4 py-2 rounded-lg"
          style={{ background: "oklch(0.14 0.03 258)" }}
        >
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: "oklch(0.52 0.04 255)" }}
          >
            Total Inquiries
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: "oklch(0.88 0.16 200)" }}
          >
            {forms.length}
          </p>
        </div>
        <div
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
          style={{
            background: "oklch(0.14 0.03 258)",
            color: "oklch(0.52 0.04 255)",
            border: "1px solid oklch(0.88 0.16 200 / 0.1)",
          }}
        >
          <Shield
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
          Read-only — Admin view only
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="inquiries.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
        </div>
      ) : forms.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "oklch(0.14 0.03 258)" }}
          data-ocid="inquiries.empty_state"
        >
          <FileText
            className="w-12 h-12 mx-auto mb-3 opacity-40"
            style={{ color: "oklch(0.88 0.16 200)" }}
          />
          <p className="font-medium" style={{ color: "oklch(0.63 0.04 250)" }}>
            No inquiries yet
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.03 255)" }}>
            Contact form submissions will appear here
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(0.88 0.16 200 / 0.12)" }}
          data-ocid="inquiries.table"
        >
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "oklch(0.88 0.16 200 / 0.12)" }}>
                {["Name", "Email", "Phone", "Message", "Date"].map((h) => (
                  <TableHead
                    key={h}
                    style={{
                      color: "oklch(0.88 0.16 200)",
                      background: "oklch(0.14 0.03 258)",
                    }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form, i) => (
                <TableRow
                  key={form.id.toString()}
                  data-ocid={`inquiries.item.${i + 1}`}
                  style={{
                    borderColor: "oklch(0.88 0.16 200 / 0.08)",
                    background:
                      i % 2 === 0
                        ? "oklch(0.10 0.03 260)"
                        : "oklch(0.12 0.03 259)",
                  }}
                >
                  <TableCell>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "oklch(1 0 0)" }}
                    >
                      {form.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.63 0.04 250)" }}
                    >
                      {form.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.63 0.04 250)" }}
                    >
                      {form.phone || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "oklch(0.63 0.04 250)" }}
                      title={form.message}
                    >
                      {form.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.52 0.04 255)" }}
                    >
                      {new Date(
                        Number(form.timestamp) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ setPage }: { setPage: (p: AdminPage) => void }) {
  const { login, isLoggingIn, isLoginError, loginError, isInitializing } =
    useInternetIdentity();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "oklch(0.08 0.02 260)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-7"
        style={{
          background: "oklch(0.10 0.03 260)",
          border: "1px solid oklch(0.88 0.16 200 / 0.2)",
          boxShadow: "0 0 40px oklch(0.88 0.16 200 / 0.08)",
        }}
        data-ocid="admin.panel"
      >
        {/* Logo */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "oklch(0.88 0.16 200 / 0.12)" }}
          >
            <Star
              className="w-8 h-8"
              style={{
                color: "oklch(0.88 0.16 200)",
                fill: "oklch(0.88 0.16 200)",
              }}
            />
          </div>
          <div>
            <h1
              className="text-2xl font-display font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.88 0.16 200)" }}
            >
              Star Pools
            </h1>
            <p
              className="text-sm font-medium uppercase tracking-widest mt-1"
              style={{ color: "oklch(0.52 0.04 255)" }}
            >
              Admin Panel
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: "oklch(0.88 0.16 200 / 0.12)" }}
        />

        {/* Internet Identity Login */}
        <div className="space-y-4">
          {isLoginError && loginError && (
            <div
              className="rounded-xl px-4 py-3 text-sm text-center"
              style={{
                background: "oklch(0.62 0.22 25 / 0.12)",
                border: "1px solid oklch(0.62 0.22 25 / 0.3)",
                color: "oklch(0.75 0.18 25)",
              }}
              data-ocid="admin.error_state"
            >
              {loginError.message}
            </div>
          )}

          <Button
            type="button"
            className="w-full h-12 font-semibold text-sm gap-3 rounded-xl"
            data-ocid="admin.login_submit_button"
            disabled={isLoggingIn || isInitializing}
            onClick={() => {
              if (isInitializing || isLoggingIn) return;
              login();
            }}
            style={{
              background: "oklch(0.88 0.16 200)",
              color: "oklch(0.08 0.025 264)",
              boxShadow: "0 0 20px oklch(0.88 0.16 200 / 0.3)",
            }}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : isInitializing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                Sign in with Internet Identity
              </>
            )}
          </Button>

          <p
            className="text-xs text-center leading-relaxed"
            style={{ color: "oklch(0.45 0.03 255)" }}
          >
            Uses your device fingerprint or PIN. No password needed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPage("home")}
          data-ocid="admin.link"
          className="w-full text-center text-sm transition-colors"
          style={{ color: "oklch(0.52 0.04 255)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.88 0.16 200)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "oklch(0.52 0.04 255)";
          }}
        >
          ← Back to Website
        </button>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({
  setPage,
  onLogout,
}: {
  setPage: (p: AdminPage) => void;
  onLogout: () => void;
}) {
  const handleLogout = () => {
    onLogout();
    setPage("home");
    toast.success("Logged out successfully");
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.02 260)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8"
        style={{
          background: "oklch(0.10 0.03 260 / 0.92)",
          backdropFilter: "blur(20px) saturate(1.8)",
          borderBottom: "1px solid oklch(0.88 0.16 200 / 0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage("home")}
              className="flex items-center gap-2 group"
              data-ocid="admin.link"
            >
              <Star
                className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300"
                style={{
                  color: "oklch(0.88 0.16 200)",
                  fill: "oklch(0.88 0.16 200)",
                }}
              />
              <span
                className="font-display font-bold tracking-widest uppercase text-sm"
                style={{ color: "oklch(0.88 0.16 200)" }}
              >
                Star Pools
              </span>
            </button>
            <span
              className="text-xs px-2 py-0.5 rounded-md font-semibold uppercase tracking-widest"
              style={{
                background: "oklch(0.88 0.16 200 / 0.12)",
                color: "oklch(0.88 0.16 200)",
                border: "1px solid oklch(0.88 0.16 200 / 0.25)",
              }}
            >
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "oklch(0.70 0.17 145)" }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(0.52 0.04 255)" }}
              >
                Internet Identity
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg"
              style={{
                background: "oklch(0.70 0.17 145 / 0.12)",
                color: "oklch(0.70 0.17 145)",
                border: "1px solid oklch(0.70 0.17 145 / 0.2)",
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Admin
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              data-ocid="admin.secondary_button"
              className="gap-2 h-8 text-xs"
              style={{ color: "oklch(0.63 0.04 250)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1
            className="text-3xl font-display font-bold"
            style={{ color: "oklch(1 0 0)" }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "oklch(0.52 0.04 255)" }}>
            Manage your Star Pools website content
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList
            className="h-12 p-1 rounded-xl"
            style={{
              background: "oklch(0.14 0.03 258)",
              border: "1px solid oklch(0.88 0.16 200 / 0.12)",
            }}
          >
            <TabsTrigger
              value="projects"
              data-ocid="admin.tab"
              className="gap-2 rounded-lg text-sm font-medium transition-all data-[state=active]:text-[oklch(0.08_0.025_264)]"
              style={
                {
                  "--tw-text-opacity": "1",
                  color: "oklch(0.63 0.04 250)",
                } as React.CSSProperties
              }
            >
              <Droplets className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              data-ocid="admin.tab"
              className="gap-2 rounded-lg text-sm font-medium transition-all data-[state=active]:text-[oklch(0.08_0.025_264)]"
              style={{ color: "oklch(0.63 0.04 250)" }}
            >
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              data-ocid="admin.tab"
              className="gap-2 rounded-lg text-sm font-medium transition-all data-[state=active]:text-[oklch(0.08_0.025_264)]"
              style={{ color: "oklch(0.63 0.04 250)" }}
            >
              <FileText className="w-4 h-4" />
              Inquiries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-0">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-0">
            <TestimonialsTab />
          </TabsContent>

          <TabsContent value="inquiries" className="mt-0">
            <InquiriesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage({ setPage }: AdminPageProps) {
  const { identity, clear } = useInternetIdentity();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginScreen setPage={setPage} />;
  }

  const handleLogout = () => {
    clear();
  };

  return <AdminDashboard setPage={setPage} onLogout={handleLogout} />;
}
