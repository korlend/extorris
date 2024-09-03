"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileHandler_1 = __importDefault(require("../utils/FileHandler"));
class ConfigLoader {
    static instance;
    mainConfig;
    configObj;
    configPath = "./config/config.json";
    constructor() {
        return this;
    }
    static async getInstance() {
        if (ConfigLoader.instance) {
            return ConfigLoader.instance;
        }
        ConfigLoader.instance = new ConfigLoader();
        await ConfigLoader.instance.reload();
        return ConfigLoader.instance;
    }
    async reload() {
        this.configObj = await FileHandler_1.default.readFile(this.configPath);
    }
    get(path) {
        const paths = path.split('.');
        let cNest = this.configObj;
        for (let i = 0; i < paths.length; i++) {
            const cPath = paths[i];
            cNest = cNest?.[cPath] || null;
        }
        return cNest;
    }
}
exports.default = ConfigLoader;
//# sourceMappingURL=ConfigLoader.js.map