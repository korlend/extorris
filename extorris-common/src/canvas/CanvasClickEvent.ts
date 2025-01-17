import type CanvasBlock from "./CanvasBlock";
import type CanvasDrawOptions from "./CanvasDrawOptions";

export default interface CanvasClickEvent {
  event: MouseEvent;
  context: CanvasRenderingContext2D;
  options: CanvasDrawOptions;
  clickedCanvasBlock?: CanvasBlock;
}
