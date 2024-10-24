import FileHandler from "../utils/FileHandler.js";

export default class ConfigLoader {
  private static instance: ConfigLoader;
  private static configPath: string = "./config/config.json";
  private configObj?: any;

  // private constructor() {
  //   return this;
  // }

  public static getInstance(): ConfigLoader | null {
    if (!ConfigLoader.instance) {
      return null;
    }

    return ConfigLoader.instance;
  }

  public static async reload() {
    ConfigLoader.instance = new ConfigLoader();
    ConfigLoader.instance.configObj = await FileHandler.readFile(ConfigLoader.configPath);
  }

  public get configExists() {
    return !!this.configObj;
  }

  public get(path: string) {
    const paths = path.split(".");
    let cNest = this.configObj;
    for (let i = 0; i < paths.length; i++) {
      const cPath = paths[i];
      cNest = cNest?.[cPath] || null;
    }
    return cNest;
  }
}
