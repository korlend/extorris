<template>
  <div class="canvas__block" ref="canvasParentElementRefName">
    <div class="fps" v-if="showFPS">
      {{ fpsArray.length }}
    </div>
    <div class="controls" v-if="showDebug">
      <button class="controls-button" @click="snapToCenter">stc</button>
      <span>cmp: {{ canvasMousePos }}</span>
      <span>cs: {{ currentShift }}</span>
      <!-- <span>amount: {{ amount }}</span> -->
      <!-- <span
        >timeFromInit:
        {{ (new Date().getTime() - timeFromInit.getTime()) / 1000 }}</span
      > -->
    </div>
    <!-- <div class="debug">
      <span>activeHover: {{ globalActiveHover }}</span>
    </div> -->
    <canvas
      class="canvas__block-canvas"
      :class="canvasClasses"
      ref="canvasRefName"
      :width="canvasWidth"
      :height="canvasHeight"
      @wheel="scrollEvent"
      @touchstart="dragStart"
      @touchend="dragEnd"
      @mousedown="dragStart"
      @mouseup="dragEnd"
      @touchmove="dragEvent"
      @mousemove="dragEvent">
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
  watch,
} from "vue";
import type Vector2D from "src/interfaces/Vector2D";
import {
  type CanvasClickEvent,
  type CanvasBlock,
  type CanvasElement,
  type CanvasDrawOptions,
  CanvasCursors,
} from "./";
import { calcDistance } from "../utils/calc";

type DrawFunction = (
  context: CanvasRenderingContext2D,
  options: CanvasDrawOptions
) => void;

type CanvasBlocks = Array<CanvasBlock>;

const emit = defineEmits<{
  (e: "action:click", canvasEvent: CanvasClickEvent): void;
}>();

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
  showDebug: {
    type: Boolean,
    default: true,
  },
  centerOnRender: {
    type: Boolean,
    default: true,
  },
});

const canvasRef = useTemplateRef("canvasRefName");
const canvasParentElementRef = useTemplateRef("canvasParentElementRefName");

const globalActiveHover: Ref<CanvasBlock | null> = ref(null);

const amount = ref(0);
const timeFromInit = new Date();

const maxCoordinates = props.maxCoordinates;
const canvasWidth: Ref<number> = ref(maxCoordinates);
const canvasHeight: Ref<number> = ref(maxCoordinates);

let rendering = props.rendering;
let lastRedrawTime = new Date();

let context: CanvasRenderingContext2D | null | undefined;

const canvasMousePos: Ref<Vector2D | null> = ref(null);

let currentScaling = 1;
const maxScaling = 1;
const minScaling = 0.1;
const scalingStep = 0.1;
const floorScaling = 100;
const pinchScalingStep = 0.01;
const pinchScalingThreshold = 10;

const fpsArray: Ref<Array<Date>> = ref([]);

let draggingStartPosX: number = 0;
let draggingEndPosX: number = 0;
let draggingStartPosY: number = 0;
let draggingEndPosY: number = 0;

let touchStartEvent: MouseEvent | TouchEvent | null = null;
let touchStartTime: Date | null = null;
let touchStartCoords: { x: number; y: number } | null = null;

let pinchInitDistance: number | null = null;

const isDragging: Ref<boolean> = ref(false);
const prevShift: { x: number; y: number } = { x: 0, y: 0 };
const currentShift: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });

const windowSize: Ref<{ height: number; width: number }> = ref({
  height: 0,
  width: 0,
});

const cursor: Ref<CanvasCursors> = ref(CanvasCursors.DEFAULT);

let canvasParentElementPos: Vector2D = { x: 0, y: 0 };

watch(windowSize, () => {
  canvasWidth.value = windowSize.value.width - canvasParentElementPos.x;
  canvasHeight.value = windowSize.value.height - canvasParentElementPos.y;
})

onBeforeMount(() => {});

onMounted(() => {
  if (canvasParentElementRef.value) {
    const { left, top } = canvasParentElementRef.value.getBoundingClientRect();
    canvasParentElementPos = {
      x: left,
      y: top,
    };
  }
  setWindowSizes();
  window.addEventListener("resize", windowResize);

  if (props.centerOnRender) {
    snapToCenter();
  }

  // canvasWidth.value = windowSize.value.width - canvasParentElementPos.x;
  // canvasHeight.value = windowSize.value.height - canvasParentElementPos.y;

  context = canvasRef.value?.getContext("2d");
  if (context !== null && context !== undefined) {
    requestAnimationFrame(() => redraw(context));
  }
});

onBeforeUnmount(() => {
  rendering = false;
  // window.removeEventListener("mousemove", dragEvent);
  // window.removeEventListener("touchmove", dragEvent);
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
    -currentScaling, // minus(-) to switch for cartesian coordinate system
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
    if (path instanceof Path2D) {
      if (color) {
        context.fillStyle = color;
      }
      context.fill(path);
    } else {
      context.drawImage(path.image, path.width, path.height);
    }
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
    const { path, color, position, rotate, width, height } = element;
    if (!(path instanceof Path2D)) {
      continue;
    }
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
  if (!mousePos) {
    return false;
  }
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

const clickEvent = async (event: MouseEvent | TouchEvent) => {
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
  const clickEvent = {
    event,
    context,
    options: getCanvasDrawOptions(),
    clickedCanvasBlock,
  };
  if (typeof clickedCanvasBlock?.clickCallback === "function") {
    await clickedCanvasBlock.clickCallback(clickEvent);
  }
  emit("action:click", clickEvent);
  context.restore();
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
};

const snapToCenter = () => {
  currentShift.value.x = windowSize.value.width / 2;
  currentShift.value.y = windowSize.value.height / 2;
  prevShift.x = windowSize.value.width / 2;
  prevShift.y = windowSize.value.height / 2;
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
    if (event.targetTouches.length === 1) {
      x = event?.touches?.[0].clientX;
      y = event?.touches?.[0].clientY;
    } else if (event.targetTouches.length === 2) {
      dragEnd();
      const touch1 = event?.touches?.[0];
      const touch2 = event?.touches?.[1];
      const point1 = { x: touch1.clientX, y: touch1.clientY };
      const point2 = { x: touch2.clientX, y: touch2.clientY };
      pinchInitDistance = calcDistance(point1, point2);
      return;
    }
  }

  canvasMousePos.value = { x, y };
  touchStartEvent = event;
  touchStartTime = new Date();
  touchStartCoords = { x, y };

  isDragging.value = true;
  draggingStartPosX = x;
  draggingEndPosX = x;
  draggingStartPosY = y;
  draggingEndPosY = y;
};

const dragEnd = (event?: MouseEvent | TouchEvent) => {
  isDragging.value = false;
  draggingStartPosX = 0;
  draggingEndPosX = 0;
  draggingStartPosY = 0;
  draggingEndPosY = 0;
  prevShift.x = currentShift.value.x;
  prevShift.y = currentShift.value.y;

  if (touchStartTime) {
    const diff = new Date().getTime() - touchStartTime.getTime();
    console.log(diff);
    if (diff < 150 && touchStartEvent) {
      clickEvent(touchStartEvent);
    }
  }
  touchStartEvent = null;
  touchStartTime = null;
  touchStartCoords = null;
  canvasMousePos.value = null;
};

const dragEvent = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation();
  event.preventDefault();
  let x, y;
  if (event instanceof MouseEvent) {
    x = event.layerX;
    y = event.layerY;
  } else if (event instanceof TouchEvent) {
    if (event.targetTouches.length === 1) {
      x = event?.touches?.[0].clientX;
      y = event?.touches?.[0].clientY;
    } else if (event.targetTouches.length === 2) {
      doubleTouchDrag(event);
      return;
    }
  }
  if (x !== undefined && y !== undefined) {
    canvasMousePos.value = { x, y };
    if (isDragging.value) {
      draggingEndPosX = x;
      draggingEndPosY = y;
      const newShiftX = prevShift.x + draggingEndPosX - draggingStartPosX;
      const newShiftY = prevShift.y + draggingEndPosY - draggingStartPosY;
      currentShift.value.x = newShiftX;
      currentShift.value.y = newShiftY;
    }
  }
};

const doubleTouchDrag = (event: TouchEvent) => {
  if (event.targetTouches.length === 2) {
    const touch1 = event?.touches?.[0];
    const touch2 = event?.touches?.[1];
    const point1 = { x: touch1.clientX, y: touch1.clientY };
    const point2 = { x: touch2.clientX, y: touch2.clientY };
    const newPinchDistance = calcDistance(point1, point2);
    if (!pinchInitDistance) {
      pinchInitDistance = newPinchDistance;
      return;
    }
    const diff = newPinchDistance - pinchInitDistance;
    const absDiff = Math.abs(diff);
    if (absDiff < pinchScalingThreshold) {
      return;
    }
    let newCurrentScaling = currentScaling;
    if (diff < 0) {
      newCurrentScaling -= pinchScalingStep;
    } else {
      newCurrentScaling += pinchScalingStep;
    }
    if (newCurrentScaling > maxScaling || newCurrentScaling < minScaling) {
      return;
    }
    currentScaling = newCurrentScaling;
  }
};

const windowResize = () => {
  setWindowSizes();
};

const setWindowSizes = () => {
  windowSize.value.height = window.innerHeight;
  windowSize.value.width = window.innerWidth;
};
</script>

<style lang="scss" scoped>
.fps {
  position: absolute;
  left: 10px;
  bottom: 50px;
  color: white;
  backdrop-filter: blur(10px);
  height: 30px;
  width: 50px;
  text-align: center;
  line-height: 30px;
  color: red;
}

.controls {
  display: flex;
  flex-flow: row;
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

  &-button {
    border: 1px solid grey;
    color: grey;
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
