export function getBackendUrl() {
  const config = useRuntimeConfig();
  return config.public.backendUrl;
}

export function getCommsUrl() {
  const config = useRuntimeConfig();
  return config.public.commsUrl;
}

export function getImagesUrl() {
  return `${getBackendUrl()}/images`;
}
