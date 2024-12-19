<template>
  <div class="hub__page">
    <BlocksCanvasBlock
      :draw-function="draw"
      :canvas-blocks="canvasBlocks"></BlocksCanvasBlock>
  </div>
</template>

<script setup lang="ts">
import CanvasCursors from "~/core/enums/canvas/CanvasCursors";
import type CanvasBlock from "~/core/interfaces/canvas/CanvasBlock";
import type DrawOptions from "~/core/interfaces/canvas/DrawOptions";
import type Vector2D from "~/core/interfaces/Vector2D";

const maxDepth = 30;

const hexSize = 100;
const hexYOffset = 25;
const hexGap = 2;

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

onBeforeMount(() => {});

onMounted(() => {
  for (let depth = 0; depth < maxDepth; depth++) {
    const maxHubNumber = depth * 6 || 1;
    for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {
      const pos = calcPos(hubNumber, depth, hexSize);
      const hex = getHexagon(hexSize, hexYOffset, hexGap);
      canvasBlocks.value.push({
        zindex: 0,
        position: pos,
        fill: [
          {
            path: hex,
            color: `rgb(150,150,150)`,
          },
        ],
        hoverWhen: [hex],
        hoverChange: {
          cursor: CanvasCursors.POINTER,
          fill: [
            {
              path: hex,
              color: `rgb(255,255,255)`,
            },
          ],
        },
      });
    }
  }
});

onBeforeUnmount(() => {});

const getHexagon = (
  iHexSize: number,
  iHexYOffset: number,
  iHexGap: number
): Path2D => {
  const hexagon = new Path2D();
  iHexSize = iHexSize / 2 - iHexGap;
  hexagon.moveTo(-iHexSize, iHexSize - iHexYOffset);
  hexagon.lineTo(0, iHexSize);
  hexagon.lineTo(iHexSize, iHexSize - iHexYOffset);
  hexagon.lineTo(iHexSize, iHexYOffset - iHexSize);
  hexagon.lineTo(0, -iHexSize);
  hexagon.lineTo(-iHexSize, iHexYOffset - iHexSize);
  return hexagon;
};

const draw = (context: CanvasRenderingContext2D, options: DrawOptions) => {};

const calcPos = (
  itemNumber: number,
  depth: number,
  iHexagonSize: number,
  initPosX: number = 0,
  iniPosX: number = 0
): Vector2D => {
  let x: number = 0,
    y: number = 0;

  const hexagonSize = iHexagonSize;
  const initialPositionX = initPosX;
  const initialPositionY = iniPosX;

  const isTopRow = itemNumber >= 0 && itemNumber <= depth;
  const isRightRow = itemNumber > depth && itemNumber < depth * 3;
  const isBottomRow = itemNumber >= depth * 3 && itemNumber <= depth * 4;
  const isLeftRow = itemNumber > depth * 4;

  if (depth == 0) {
    return { x: initialPositionX, y: initialPositionY };
  }

  if (isTopRow) {
    const initialX = initialPositionX - depth * hexagonSize * 0.5;
    x = initialX + itemNumber * hexagonSize;
    y = initialPositionY - depth * hexagonSize * 0.75;
  } else if (isBottomRow) {
    const initialX = initialPositionX + 0.5 * depth * hexagonSize;
    const localItemNumber = itemNumber - depth * 3;
    x = initialX - localItemNumber * hexagonSize;
    y = initialPositionY + depth * hexagonSize * 0.75;
  } else if (isRightRow) {
    const isIncreasing = itemNumber < depth * 2;
    const isDecreasing = itemNumber > depth * 2;
    if (isIncreasing) {
      const initialX =
        initialPositionX + hexagonSize + (depth - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY - depth * hexagonSize * 0.75;
      const localItemNumber = itemNumber - depth;
      x = initialX + (localItemNumber - 1) * hexagonSize * 0.5;
      y = initialY + localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX + hexagonSize + (depth - 1) * hexagonSize;
      const localItemNumber = itemNumber - depth * 2;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialPositionY + localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX + depth * hexagonSize;
      y = initialPositionY;
    }
  } else if (isLeftRow) {
    const isIncreasing = itemNumber < depth * 5;
    const isDecreasing = itemNumber > depth * 5;
    if (isIncreasing) {
      const initialX =
        initialPositionX - hexagonSize * 0.5 - (depth - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY + depth * hexagonSize * 0.75;
      const localItemNumber = itemNumber - depth * 4;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialY - localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX - hexagonSize - (depth - 1) * hexagonSize;
      const localItemNumber = itemNumber - depth * 5;
      x = initialX + localItemNumber * hexagonSize * 0.5;
      y = initialPositionY - localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX - depth * hexagonSize;
      y = initialPositionY;
    }
  }

  return { x: Math.floor(x), y: Math.floor(y) };
};
</script>

<style lang="scss" scoped>
.fps {
  position: fixed;
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
  position: fixed;
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

.hub__page {
  &-canvas {
    // width: 100%;
    // height: 100%;
    // border: 1px solid grey;
  }
}
</style>
