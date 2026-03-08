import { useQuery } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

const ADMIN_ACTOR_KEY = "adminActor";

// The hardcoded admin secret that matches the backend isAdminToken check
export const ADMIN_TOKEN = "starpools-admin-kushal-2024";

/**
 * Returns an anonymous actor + the admin secret token.
 * All write operations must use the adminCreate/adminUpdate/adminDelete
 * functions which accept the token directly in the call.
 */
export function useAdminActor() {
  const query = useQuery<{ actor: backendInterface; secret: string }>({
    queryKey: [ADMIN_ACTOR_KEY],
    queryFn: async () => {
      const actor = await createActorWithConfig();
      return { actor, secret: ADMIN_TOKEN };
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: 2,
  });

  return {
    adminActor: query.data?.actor || null,
    adminSecret: query.data?.secret || ADMIN_TOKEN,
    isInitializing: query.isLoading,
    error: query.error,
  };
}
