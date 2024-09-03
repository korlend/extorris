import ConfigModel from "src/models/config/ConfigModel";
import FileHandler from "../utils/FileHandler";

export default class ConfigLoader {
  private static instance: ConfigLoader;
  private mainConfig?: ConfigModel;
  private configObj: any;
  private configPath: string = "./config/config.json";

  private constructor() {
    return this;
  }

  public static async getInstance(): Promise<ConfigLoader> {
    if (ConfigLoader.instance) {
      return ConfigLoader.instance;
    }

    ConfigLoader.instance = new ConfigLoader();
    await ConfigLoader.instance.reload();

    return ConfigLoader.instance;
  }

  public async reload() {
    this.configObj = await FileHandler.readFile(this.configPath);
  }

  public get(path: string) {
    const paths = path.split('.');
    // console.log('paths.length', paths.length);
    let cNest = this.configObj;
    for (let i = 0; i < paths.length; i++) {
      const cPath = paths[i];
      // console.log('cNest', cNest);
      cNest = cNest?.[cPath] || null;
    }
    return cNest;
  }
}
