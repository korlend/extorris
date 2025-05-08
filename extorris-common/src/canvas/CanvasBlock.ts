import type Vector2D from "src/interfaces/Vector2D";
import type { CanvasClickEvent, CanvasCursors, CanvasElement } from ".";

export type HoverChange = {
  fill?: Array<CanvasElement>;
  stroke?: Array<CanvasElement>;
  cursor?: CanvasCursors;
};

export default interface CanvasBlock {
  name?: string;
  fill?: Array<CanvasElement>;
  stroke?: Array<CanvasElement>;
  children?: Array<CanvasBlock>;
  hoverWhen?: Array<Path2D>;
  hoverChange?: HoverChange;
  clickCallback?: (event: CanvasClickEvent) => void;
  position?: Vector2D;
  rotate?: number; // degrees
  zindex?: number;
}
