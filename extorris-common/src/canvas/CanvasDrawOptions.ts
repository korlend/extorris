import type Vector2D from "src/interfaces/Vector2D";

export default interface CanvasDrawOptions {
  currentScaling: number;
  currentShift: Vector2D;
  prevShift: Vector2D;
  canvasMousePos: Vector2D | null;
}
