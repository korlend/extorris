import type Vector2D from "../Vector2D";

export default interface DrawOptions {
  currentScaling: number;
  currentShift: Vector2D;
  prevShift: Vector2D;
  canvasMousePos: Vector2D;
}