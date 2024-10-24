import ExpressNext from "@src/models/ExpressNext.js";
import { NextFunction } from "express";

// maybe it's a bad idea, couldn't redefine NextFunction from express with *.d.ts
// unused
export default interface ExpressNextFunction extends NextFunction {
  (err?: ExpressNext): void;
}
