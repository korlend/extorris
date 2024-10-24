export default class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  dot(other: Vector2D) {
    return this.x * other.x + this.y * other.y;
  }
}