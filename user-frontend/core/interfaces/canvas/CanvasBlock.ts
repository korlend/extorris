import type CanvasCursors from "~/core/enums/canvas/CanvasCursors";
import type Vector2D from "../Vector2D";
import type CanvasElement from "./CanvasElement";

type HoverChange = {
  fill?: Array<CanvasElement>;
  stroke?: Array<CanvasElement>;
  cursor?: CanvasCursors;
};

export default interface CanvasBlock {
  name?: string;
  fill?: Array<CanvasElement>;
  stroke?: Array<CanvasElement>;
  hoverWhen?: Array<Path2D>;
  hoverChange?: HoverChange;
  clickCallback?: Function;
  position?: Vector2D;
  zindex?: number;
}
