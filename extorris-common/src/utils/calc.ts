import type Vector2D from "src/interfaces/Vector2D";

export function calcDistance(point1: Vector2D, point2: Vector2D) {
  const distance = Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
  return Math.floor(distance * 100) / 100;
}
