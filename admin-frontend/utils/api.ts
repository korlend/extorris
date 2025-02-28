export function getBackendUrl() {
  const config = useRuntimeConfig();
  return config.public.backendUrl;
}

export function getImagesUrl() {
  return `${getBackendUrl()}/images`;
}
