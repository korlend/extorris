
export function getConfigValue(path: string) {
  const websiteConfig: any = useState("config").value;
  const paths = path.split(".");
  let cNest: Record<string, any> = websiteConfig;
  for (let i = 0; i < paths.length; i++) {
    const cPath = paths[i];
    cNest = cNest?.[cPath] || null;
  }
  return cNest;
}

export function getConfig() {
  const websiteConfig = useState("config").value;
  return websiteConfig;
}
