<template>
  <div class="canvas__block" ref="canvasParentElementRef">
    <div class="fps" v-if="showFPS">
      {{ fpsArray.length }}
    </div>
    <div class="controls">
      <span>canvasMousePos: {{ canvasMousePos }}</span>
      <span>currentShift: {{ currentShift }}</span>
      <span>amount: {{ amount }}</span>
      <span>timeFromInit: {{ (new Date().getTime() - timeFromInit.getTime()) / 1000 }}</span>
    </div>
    <!-- <div class="debug">
      <span>activeHover: {{ globalActiveHover }}</span>
    </div> -->
    <canvas
      class="canvas__block-canvas"
      :class="canvasClasses"
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @wheel="scrollEvent"
      @click="clickEvent"
      @mousedown.prevent.stop="dragStart"
      @mousemove="mouseMove">
      <div>loading</div>
    </canvas>
  </div>
</template>

<script setup lang="ts">
import {
  type PropType,
  useTemplateRef,
  ref,
  type Ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import type Vector2D from "src/interfaces/Vector2D";
import type CanvasBlock from "./CanvasBlock";
import type CanvasClickEvent from "./CanvasClickEvent";
import CanvasCursors from "./CanvasCursors";
import type CanvasElement from "./CanvasElement";
import type CanvasDrawOptions from "./CanvasDrawOptions";

type DrawFunction = (
  context: CanvasRenderingContext2D,
  options: CanvasDrawOptions
) => void;

type CanvasBlocks = Array<CanvasBlock>;

const props = defineProps({
  drawFunction: {
    type: Function as PropType<DrawFunction>,
    default: () => {},
  },
  canvasBlocks: {
    type: Array as PropType<CanvasBlocks>,
    default: () => [],
  },
  maxCoordinates: {
    type: Number,
    default: 2000,
  },
  rendering: {
    type: Boolean,
    default: true,
  },
  showFPS: {
    type: Boolean,
    default: true,
  },
  centerOnRender: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: "action:click", canvasEvent: CanvasClickEvent): void;
}>();

const canvasRef = useTemplateRef("canvasRef");
const canvasParentElementRef = useTemplateRef("canvasParentElementRef");

const globalActiveHover: Ref<CanvasBlock | null> = ref(null);

const amount = ref(0);
const timeFromInit = new Date();

const maxCoordinates = props.maxCoordinates;
const canvasWidth: Ref<number> = ref(maxCoordinates);
const canvasHeight: Ref<number> = ref(maxCoordinates);

let rendering = props.rendering;
let lastRedrawTime = new Date();

let context: CanvasRenderingContext2D | null | undefined;

const canvasMousePos: Ref<Vector2D> = ref({ x: 0, y: 0 });

let currentScaling = 1;
const maxScaling = 1;
const minScaling = 0.1;
const scalingStep = 0.1;
const floorScaling = 100;

const fpsArray: Ref<Array<Date>> = ref([]);

let draggingStartPosX: number = 0;
let draggingEndPosX: number = 0;
let draggingStartPosY: number = 0;
let draggingEndPosY: number = 0;

const isDragging: Ref<boolean> = ref(false);
const prevShift: { x: number; y: number } = { x: 0, y: 0 };
const currentShift: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });

const windowSizes: Ref<{ height: number; width: number }> = ref({
  height: 0,
  width: 0,
});

const cursor: Ref<CanvasCursors> = ref(CanvasCursors.DEFAULT);

let canvasParentElementPos: Vector2D = { x: 0, y: 0 };

onBeforeMount(() => {});

onMounted(() => {
  /*
  for showing portals on main map
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  */

  // window.addEventListener("mousemove", throttle(dragEvent, dragDelay));
  // window.addEventListener("touchmove", throttle(dragEvent, dragDelay));
  if (canvasParentElementRef.value) {
    const { left, top } = canvasParentElementRef.value.getBoundingClientRect();
    canvasParentElementPos = {
      x: left,
      y: top,
    };
  }
  setWindowSizes();
  window.addEventListener("mousemove", dragEvent);
  window.addEventListener("touchmove", dragEvent);
  window.addEventListener("resize", windowResize);

  if (props.centerOnRender) {
    currentShift.value.x = windowSizes.value.width / 2;
    currentShift.value.y = windowSizes.value.height / 2;
    prevShift.x = windowSizes.value.width / 2;
    prevShift.y = windowSizes.value.height / 2;
  }

  canvasWidth.value = windowSizes.value.width - canvasParentElementPos.x;
  canvasHeight.value = windowSizes.value.height - canvasParentElementPos.y;

  context = canvasRef.value?.getContext("2d");
  if (context !== null && context !== undefined) {
    requestAnimationFrame(() => redraw(context));
  }
});

onBeforeUnmount(() => {
  rendering = false;
  window.removeEventListener("mousemove", dragEvent);
  window.removeEventListener("touchmove", dragEvent);
  window.removeEventListener("resize", windowResize);
});

const canvasClasses = computed(() => {
  const classes = {
    pointer: cursor.value === CanvasCursors.POINTER,
  };
  return classes;
});

const globalActiveHoverStringify = computed(() => {
  const activeHover = globalActiveHover.value;

  return activeHover?.name;
});

const canvasBlocksByZIndex = computed(
  (): Record<number, Array<CanvasBlock>> => {
    console.log("canvasBlocksByZIndex");
    const canvasBlocks = props.canvasBlocks;
    const mappedCanvasBlocks: Record<number, Array<CanvasBlock>> = {};
    for (let i = 0; i < canvasBlocks.length; i++) {
      const canvasBlock = canvasBlocks[i];
      const zindex = canvasBlock.zindex || 0;
      if (!mappedCanvasBlocks[zindex]) {
        mappedCanvasBlocks[zindex] = [];
      }
      // should i unref this?
      mappedCanvasBlocks[zindex].push(canvasBlock);
    }
    return mappedCanvasBlocks;
  }
);

const sortedExistingZIndices = computed((): Array<number> => {
  console.log("sortedExistingZIndices");
  const canvasBlocks = props.canvasBlocks;
  const zIndices: Array<number> = [];
  for (let i = 0; i < canvasBlocks.length; i++) {
    const canvasBlock = canvasBlocks[i];
    const zindex = canvasBlock.zindex || 0;
    if (zIndices.some((v) => v === zindex)) {
      continue;
    }
    zIndices.push(zindex);
  }
  zIndices.sort();
  return zIndices;
});

const canvasApplyTransform = (context: CanvasRenderingContext2D) => {
  context.setTransform(
    currentScaling,
    0,
    0,
    currentScaling,
    currentShift.value.x,
    currentShift.value.y
  );
};

const canvasFill = (
  context: CanvasRenderingContext2D,
  elements: Array<CanvasElement> = []
) => {
  if (!elements?.length) {
    return;
  }
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    amount.value++;
    const { path, color, position, rotate } = element;
    context.save();
    if (position) {
      context.translate(position.x, position.y);
    }
    if (rotate) {
      context.rotate((rotate * Math.PI) / 180);
    }
    if (color) {
      context.fillStyle = color;
    }
    context.fill(element.path);
    context.restore();
  }
};

const canvasStroke = (
  context: CanvasRenderingContext2D,
  elements: Array<CanvasElement> = []
) => {
  if (!elements?.length) {
    return;
  }
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const { path, color, position, rotate } = element;
    context.save();
    if (position) {
      context.translate(position.x, position.y);
    }
    if (rotate) {
      context.rotate((rotate * Math.PI) / 180);
    }
    if (color) {
      context.strokeStyle = color;
    }
    context.stroke(path);
    context.restore();
  }
};

const checkHover = (
  context: CanvasRenderingContext2D,
  hoverWhen: Array<Path2D> = []
): boolean => {
  const mousePos = getCanvasDrawOptions().canvasMousePos;
  for (let i = 0; i < hoverWhen.length; i++) {
    if (context.isPointInPath(hoverWhen[i], mousePos.x, mousePos.y)) {
      return true;
    }
  }
  return false;
};

const redraw = async (context?: CanvasRenderingContext2D | null) => {
  if (!context) {
    return;
  }
  const time = new Date();

  const options = getCanvasDrawOptions();

  let currentCursor = CanvasCursors.DEFAULT;

  /* transform and clear */
  // context.fillStyle = `rgb(0,0,0)`;
  context.save();
  canvasApplyTransform(context);

  const clearNumber = maxCoordinates * maxCoordinates;
  context.clearRect(
    -clearNumber,
    -clearNumber,
    clearNumber + clearNumber,
    clearNumber + clearNumber
  );
  /* */

  const sortedZIndices = sortedExistingZIndices.value;
  const canvasBlocksMap = canvasBlocksByZIndex.value;

  let activeHover: CanvasBlock | null = null;

  for (let i = 0; i < sortedZIndices.length; i++) {
    const iCanvasBlocks = canvasBlocksMap[sortedZIndices[i]];
    for (let j = 0; j < iCanvasBlocks.length; j++) {
      const canvasBlock = iCanvasBlocks[j];
      const zindex = canvasBlock.zindex || 0;
      activeHover = applyCanvasBlock(context, canvasBlock, activeHover, zindex);
      globalActiveHover.value = activeHover;
      // context.save()
      // const { fill, stroke, hoverWhen, position } = canvasBlock
      // if (position) {
      //   context.translate(position.x, position.y)
      // }
      // canvasFill(context, fill)
      // canvasStroke(context, stroke)

      // if (checkHover(context, hoverWhen)) {
      //   const activeHoverZIndex = activeHover?.zindex || 0
      //   if (!activeHover || activeHoverZIndex <= zindex) {
      //     activeHover = canvasBlock
      //   }
      // }
      // context.restore()
    }
  }

  if (activeHover) {
    context.save();
    const { hoverChange, position, rotate } = activeHover;
    if (position) {
      context.translate(position.x, position.y);
    }
    if (rotate) {
      context.rotate((rotate * Math.PI) / 180);
    }
    canvasFill(context, hoverChange?.fill);
    canvasStroke(context, hoverChange?.stroke);
    if (hoverChange?.cursor) {
      currentCursor = hoverChange?.cursor;
    }
    context.restore();
  }

  if (typeof props.drawFunction === "function") {
    props.drawFunction(context, options);
  }

  context.restore();

  cursor.value = currentCursor;

  // fps
  fpsArray.value.push(time);
  lastRedrawTime = time;
  fpsArray.value = fpsArray.value.filter(
    (v) => v.getTime() > time.getTime() - 1000
  );
  if (rendering) {
    requestAnimationFrame(() => redraw(context));
  }
};

const applyCanvasBlock = (
  context: CanvasRenderingContext2D,
  canvasBlock: CanvasBlock,
  activeHover: CanvasBlock | null,
  zindex: number,
  currentDepth: number = 0
): CanvasBlock | null => {
  context.save();
  const { fill, stroke, hoverWhen, position, rotate, children } = canvasBlock;
  if (position) {
    context.translate(position.x, position.y);
  }
  if (rotate) {
    context.rotate((rotate * Math.PI) / 180);
  }
  canvasFill(context, fill);
  canvasStroke(context, stroke);

  if (checkHover(context, hoverWhen)) {
    if (currentDepth) {
      activeHover = canvasBlock;
    } else {
      const activeHoverZIndex = zindex;
      if (!activeHover || activeHoverZIndex <= zindex) {
        activeHover = canvasBlock;
      }
    }
  }

  if (children?.length) {
    for (let i = 0; i < children?.length; i++) {
      activeHover = applyCanvasBlock(
        context,
        children[i],
        activeHover,
        zindex,
        currentDepth + 1
      );
    }
  }

  context.restore();
  return activeHover;
};

const getCanvasDrawOptions = (): CanvasDrawOptions => {
  return {
    currentScaling: currentScaling,
    currentShift: currentShift.value,
    prevShift: prevShift,
    canvasMousePos: canvasMousePos.value,
  };
};

const clickEvent = async (event: MouseEvent) => {
  if (!context) {
    return;
  }
  context.save();
  canvasApplyTransform(context);

  const sortedZIndices = sortedExistingZIndices.value;
  const canvasBlocksMap = canvasBlocksByZIndex.value;

  let clickedCanvasBlock: CanvasBlock | undefined;

  for (let i = 0; i < sortedZIndices.length; i++) {
    const iCanvasBlocks = canvasBlocksMap[sortedZIndices[i]];
    for (let j = 0; j < iCanvasBlocks.length; j++) {
      const canvasBlock = iCanvasBlocks[j];
      const zindex = canvasBlock?.zindex || 0;
      context.save();
      const { hoverWhen, position } = canvasBlock;
      if (position) {
        context.translate(position.x, position.y);
      }

      if (checkHover(context, hoverWhen)) {
        const clickedBlockZIndex = clickedCanvasBlock?.zindex || 0;
        if (!clickedCanvasBlock || clickedBlockZIndex < zindex) {
          clickedCanvasBlock = canvasBlock;
        }
      }
      context.restore();
    }
  }
  if (typeof clickedCanvasBlock?.clickCallback === "function") {
    await clickedCanvasBlock.clickCallback(
      event,
      context,
      getCanvasDrawOptions(),
      clickedCanvasBlock
    );
  }
  emit("action:click", {
    event,
    context,
    options: getCanvasDrawOptions(),
    clickedCanvasBlock,
  });
  context.restore();
};

const mouseMove = (event: MouseEvent) => {
  canvasMousePos.value = { x: event.layerX, y: event.layerY };
};

const scrollEvent = (event: WheelEvent) => {
  if (!context) {
    return;
  }
  let newCurrentScaling = currentScaling;
  if (event.deltaY > 0) {
    newCurrentScaling -= scalingStep;
  } else {
    newCurrentScaling += scalingStep;
  }
  if (newCurrentScaling > maxScaling || newCurrentScaling < minScaling) {
    return;
  }
  newCurrentScaling =
    Math.floor(newCurrentScaling * floorScaling) / floorScaling;
  currentScaling = newCurrentScaling;

  // context.setTransform(1, 0, 0, 1, 0, 0);
  // context.scale(currentScaling, currentScaling);

  // event.preventDefault();
  // event.stopPropagation();
};

const dragStart = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation();
  event.preventDefault();
  let x = 0;
  let y = 0;
  if (event instanceof MouseEvent) {
    x = event.x;
    y = event.y;
  } else if (event instanceof TouchEvent) {
    x = event?.touches?.[0].clientX;
    y = event?.touches?.[0].clientY;
  }

  isDragging.value = true;
  draggingStartPosX = x;
  draggingEndPosX = x;
  draggingStartPosY = y;
  draggingEndPosY = y;
  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("touchend", dragEnd);
};

const dragEnd = () => {
  // this.currentShift -= diffX;

  // setTimeout(() => {
  //   this.calculateShift();
  // }, ANIMATION_TIME_MS);
  // shiftX.value = shiftX.value + draggingEndPosX.value;

  isDragging.value = false;
  draggingStartPosX = 0;
  draggingEndPosX = 0;
  draggingStartPosY = 0;
  draggingEndPosY = 0;
  prevShift.x = currentShift.value.x;
  prevShift.y = currentShift.value.y;
  window.removeEventListener("mouseup", dragEnd);
  window.removeEventListener("touchend", dragEnd);
};

const dragEvent = (event: MouseEvent | TouchEvent) => {
  if (isDragging.value) {
    // this.preventEvent(event);
    let x = 0;
    let y = 0;
    if (event instanceof MouseEvent) {
      x = event.x;
      y = event.y;
    } else if (event?.touches) {
      x = event?.touches?.[0].clientX;
      y = event?.touches?.[0].clientY;
    }

    draggingEndPosX = x;
    draggingEndPosY = y;

    const newShiftX = prevShift.x + draggingEndPosX - draggingStartPosX;
    const newShiftY = prevShift.y + draggingEndPosY - draggingStartPosY;

    currentShift.value.x = newShiftX;
    currentShift.value.y = newShiftY;
  }
};

const windowResize = () => {
  setWindowSizes();
};

const setWindowSizes = () => {
  windowSizes.value.height = window.innerHeight;
  windowSizes.value.width = window.innerWidth;
};
</script>

<style lang="scss" scoped>
.fps {
  position: absolute;
  top: 60px;
  left: 10px;
  color: white;
  backdrop-filter: blur(10px);
  height: 30px;
  width: 50px;
  text-align: center;
  line-height: 30px;
  color: red;
}

.controls {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 50px;
  color: red;
  backdrop-filter: blur(10px);
  line-height: 50px;

  & > * {
    margin: 0px 10px;
  }
}

.debug {
  position: absolute;
  right: 0;
  top: 60px;
  height: calc(100% - 60px);
  width: 400px;
}

.pointer {
  cursor: pointer;
}

.canvas__block {
  position: relative;

  &-canvas {
    // width: 100%;
    // height: 100%;
    // border: 1px solid grey;
  }
}
</style>
