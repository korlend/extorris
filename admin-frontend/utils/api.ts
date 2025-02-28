
export function getBackendUrl() {
  return process.env.BACKEND_URL || "http://localhost:8090";
}

export function getImagesUrl() {
  return `${getBackendUrl()}/images`;
}
