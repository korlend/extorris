import type Vector2D from "src/models/Vector2D";
import type CanvasImage from "./CanvasImage";

export default interface CanvasElement {
  path: Path2D | CanvasImage;
  color?: string | CanvasGradient | CanvasPattern;
  position?: Vector2D;
  rotate?: number; // degrees
  width?: number;
  height?: number;
}
