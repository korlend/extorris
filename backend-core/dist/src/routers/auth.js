"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const promiseFunc = async () => {
    return new Promise((resolve) => {
        resolve('312');
    });
};
router.post('/register', async (req, res, next) => {
    res.send(await promiseFunc());
});
router.post('/login', async (req, res, next) => {
    res.send('hello world');
});
exports.default = router;
//# sourceMappingURL=auth.js.map