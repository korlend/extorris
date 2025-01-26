import type Vector2D from "src/interfaces/Vector2D";

export default interface CanvasElement {
  path: Path2D;
  color?: string | CanvasGradient | CanvasPattern;
  position?: Vector2D;
  rotate?: number; // degrees
}
