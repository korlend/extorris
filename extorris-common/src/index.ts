import type { CanvasClickEvent } from "./canvas";
import { CanvasComponent } from "./canvas";
import type Vector2D from "./types/Vector2D";
import type { CanvasBlock, CanvasElement, CanvasDrawOptions } from "./canvas";

import { CanvasCursors } from "./canvas";

export const install = (app: any) => {
  app.component("canvas-component", CanvasComponent);
};

export {
  CanvasComponent,
  CanvasCursors,
  type CanvasBlock,
  type CanvasClickEvent,
  type CanvasElement,
  type CanvasDrawOptions,
};

export default {
  install,
};

export { type Vector2D };
