import axios from "axios";

// Empty BASE_URL = use Vite proxy (routes /api/* and /uploads/* to localhost:5000)
const BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const fileBaseUrl = BASE_URL;

// Extract just the filename from any path format
const extractFilename = (filePath) => {
  if (!filePath) return null;
  // Normalise slashes
  const normalised = filePath.replace(/\\/g, "/");
  // Get just the filename (last segment)
  return normalised.split("/").pop();
};

// Helper: resolve a stored file path to a working URL
// Uses /api/file/:filename endpoint which is more reliable than static serving
export const resolveFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith("http")) return filePath;
  const filename = extractFilename(filePath);
  if (!filename) return null;
  return `${BASE_URL}/api/file/${encodeURIComponent(filename)}`;
};
