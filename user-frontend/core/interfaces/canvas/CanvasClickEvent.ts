import type CanvasBlock from "./CanvasBlock";
import type DrawOptions from "./DrawOptions";

export default interface CanvasClickEvent {
  event: MouseEvent;
  context: CanvasRenderingContext2D;
  options: DrawOptions;
  clickedCanvasBlock?: CanvasBlock;
}
