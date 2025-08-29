import type Vector2D from "src/models/Vector2D";

export function getEllipse(
  verticalRadius: number,
  horizontalRadius: number
): Path2D {
  const halfEllipse = new Path2D();
  halfEllipse.ellipse(
    0,
    0,
    verticalRadius,
    horizontalRadius,
    0,
    0,
    Math.PI * 2
  );
  return halfEllipse;
}

export function getLine(start: Vector2D, end: Vector2D): Path2D {
  const line = new Path2D();
  line.moveTo(start.x, start.y);
  line.lineTo(end.x, end.y);
  return line;
}

export function getRectangle(width: number, height: number): Path2D {
  const line = new Path2D();
  line.moveTo(-width / 2, height / 2);
  line.lineTo(width / 2, height / 2);
  line.lineTo(width / 2, -height / 2);
  line.lineTo(-width / 2, -height / 2);
  return line;
}
