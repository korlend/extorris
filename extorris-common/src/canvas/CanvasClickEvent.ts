import type CanvasBlock from "./CanvasBlock";
import type CanvasDrawOptions from "./CanvasDrawOptions";

export interface CanvasClickEvent {
  event: MouseEvent | TouchEvent;
  context: CanvasRenderingContext2D;
  options: CanvasDrawOptions;
  clickedCanvasBlock?: CanvasBlock;
}
