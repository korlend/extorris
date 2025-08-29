import { Vector2D } from "extorris-common";
import arrayShuffle from "./ArrayShuffle.js";

export default class PerlinNoiseHex {
  private wrap: number;

  constructor(wrap: number = 256) {
    this.wrap = wrap;
  }

  public makePermutation() {
    const permutation = [];
    for (let i = 0; i < this.wrap; i++) {
      permutation.push(i);
    }

    arrayShuffle(permutation);

    for (let i = 0; i < this.wrap; i++) {
      permutation.push(permutation[i]);
    }

    return permutation;
  }

  private getConstantVector(v: number) {
    // v is the value from the permutation table
    const h = v & 3;
    if (h == 0) return new Vector2D(1.0, 1.0);
    else if (h == 1) return new Vector2D(-1.0, 1.0);
    else if (h == 2) return new Vector2D(-1.0, -1.0);
    else return new Vector2D(1.0, -1.0);
  }

  private fade(t: number) {
    return ((6 * t - 15) * t + 10) * t * t * t;
  }

  private lerp(t: number, a1: number, a2: number) {
    return a1 + t * (a2 - a1);
  }

  public noise2D(x: number, y: number, permutation: Array<number>) {
    const X = Math.floor(x) & (this.wrap - 1);
    const Y = Math.floor(y) & (this.wrap - 1);

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const topRight = new Vector2D(xf - 1.0, yf - 1.0);
    const topLeft = new Vector2D(xf, yf - 1.0);
    const bottomRight = new Vector2D(xf - 1.0, yf);
    const bottomLeft = new Vector2D(xf, yf);

    // Select a value from the permutation array for each of the 4 corners
    const valueTopRight = permutation[permutation[X + 1] + Y + 1];
    const valueTopLeft = permutation[permutation[X] + Y + 1];
    const valueBottomRight = permutation[permutation[X + 1] + Y];
    const valueBottomLeft = permutation[permutation[X] + Y];

    const dotTopRight = topRight.dot(
      this.getConstantVector(valueTopRight),
    );
    const dotTopLeft = topLeft.dot(
      this.getConstantVector(valueTopLeft),
    );
    const dotBottomRight = bottomRight.dot(
      this.getConstantVector(valueBottomRight),
    );
    const dotBottomLeft = bottomLeft.dot(
      this.getConstantVector(valueBottomLeft),
    );

    const u = this.fade(xf);
    const v = this.fade(yf);

    return this.lerp(
      u,
      this.lerp(v, dotBottomLeft, dotTopLeft),
      this.lerp(v, dotBottomRight, dotTopRight),
    );
  }
}
