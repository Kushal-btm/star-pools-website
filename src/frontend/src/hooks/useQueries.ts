import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, Testimonial } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProjects() {
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

export function useGetAllTestimonials() {
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

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      message,
    }: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitContactForm(name, email, phone, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactForms"] });
    },
  });
}
