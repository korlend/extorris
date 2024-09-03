"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ConfigLoader_1 = __importDefault(require("./src/core/config/ConfigLoader"));
const HttpHelpers_1 = require("./src/core/utils/HttpHelpers");
const auth_1 = __importDefault(require("./src/routers/auth"));
async function loadConfig() {
    return await ConfigLoader_1.default.getInstance();
}
async function init() {
    const config = await loadConfig();
    const app = (0, express_1.default)();
    app.get('/', (req, res, next) => {
        res.send('hello world');
        next(123);
    });
    const port = (0, HttpHelpers_1.normalizePort)(config.get('port'));
    app.set('port', port);
    app.use(auth_1.default);
    const server = http_1.default.createServer(app);
    server.listen(port);
    server.on('error', HttpHelpers_1.onError);
    server.on('listening', HttpHelpers_1.onListening);
}
init();
//# sourceMappingURL=index.js.map