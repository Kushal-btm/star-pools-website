/**
 * usePhotoUpload — uploads image bytes to Caffeine blob storage
 * and returns a permanent HTTP URL for each uploaded photo.
 *
 * This bypasses ExternalBlob (which only gives local object URLs)
 * and goes directly to StorageClient.putFile(), which persists
 * data to the canister and produces a stable URL that survives page refreshes.
 */
import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let _storageClient: StorageClient | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (_storageClient) return _storageClient;
  const config = await loadConfig();
  const agent = await HttpAgent.create({
    host: config.backend_host,
    shouldFetchRootKey: config.backend_host?.includes("localhost") ?? false,
  });
  _storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return _storageClient;
}

/**
 * Upload a single compressed image (Uint8Array) to blob storage.
 * Returns the permanent direct URL string.
 */
export async function uploadImageBytes(
  bytes: Uint8Array<ArrayBuffer>,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const client = await getStorageClient();
  const { hash } = await client.putFile(bytes, onProgress);
  return client.getDirectURL(hash);
}

/**
 * React hook that exposes uploadImageBytes for use in components.
 */
export function usePhotoUpload() {
  const upload = useCallback(
    (bytes: Uint8Array<ArrayBuffer>, onProgress?: (pct: number) => void) =>
      uploadImageBytes(bytes, onProgress),
    [],
  );
  return { upload };
}
