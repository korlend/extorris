
export function getBackendUrl() {
  return process.env.BACKEND_URL || "http://192.168.1.102:8090";
}

export function getImagesUrl() {
  return `${getBackendUrl()}/images`;
}
