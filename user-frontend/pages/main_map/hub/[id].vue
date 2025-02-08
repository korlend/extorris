<template>
  <div
    class="hub__page"
    :style="listStyles"
    @mousedown.prevent.stop="dragStart"
    @wheel="scrollEvent">
    <div class="hub__page-coordinates">
      (x: {{ currentShift.x }}) - (y: {{ currentShift.y }})
    </div>
    <div class="hub__page-windows__size">
      (width: {{ windowSizes.width }}) - (height: {{ windowSizes.height }})
    </div>
    <div class="hub__page-extra">
      (x limit: {{ windowSizes.width - fieldSize.x - cameraLimit }}) - (y limit:
      {{ windowSizes.height - fieldSize.y - cameraLimit }})
    </div>
    <div class="hub__page-scale">
      scale: {{ currentScaling }}
    </div>
    <div class="hub__page-inner" :style="innerStyles">
      <canvas></canvas>
      <!-- <div class="hub__page-inner-ship">sheep</div> -->
      <!-- <div class="hub__page-inner-space" :style="spaceStyles">
        <div v-for="row in rowLength" class="hub__page-inner-space-row">
          <div v-for="cell in rowLength" class="hub__page-inner-space-row-cell">
            {{ `${row}:${cell}` }}
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">

import { useMainMapStore } from "@/store/main_map";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import MittEvents from "~/core/enums/MittEvents";
import { throttle } from "extorris-common";

const { $mittEmit } = useNuxtApp();

const router = useRouter();
const route = useRoute();
const mainMapStore = useMainMapStore();

const hubData: Ref<any> = ref({});

const coordinateMax = 5000;
const cellSize = 100;
const dragDelay = 50;
const scalingStep = 0.1;
const maxScaling = 2.0;
const minScaling = 0.5;

const extraSpace = 500;
const cameraLimit = 1000;
// const mouseCoordinates
// let fieldSize: { x: number, y: number } = { x: 0, y: 0 };

let draggingStartPosX: number = 0;
let draggingEndPosX: number = 0;
let draggingStartPosY: number = 0;
let draggingEndPosY: number = 0;

/** refs start */
const currentScaling: Ref<number> = ref(1.0);
const isDragging: Ref<boolean> = ref(false);
const windowSizes: Ref<{ height: number; width: number }> = ref({
  height: 0,
  width: 0,
});
// const prevShift: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });
const prevShift: { x: number; y: number } = { x: 0, y: 0 };
const currentShift: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });
/** refs end */

onMounted(() => {
  window.addEventListener("mousemove", throttle(dragEvent, dragDelay));
  window.addEventListener("touchmove", throttle(dragEvent, dragDelay));
  window.addEventListener("resize", windowResize);
  window.addEventListener("resize", windowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", throttle(dragEvent, dragDelay));
  window.removeEventListener("touchmove", throttle(dragEvent, dragDelay));
  window.removeEventListener("resize", windowResize);
  window.removeEventListener("resize", windowResize);
});

onMounted(() => {
  setWindowSizes();
  moveCameraCenter();
});

// onMounted(async () => {
//   await reload();
// });

// const hubId = computed(() => {
//   return parseInt(route.params.id as string);
// });

// const reload = async () => {
//   const response = await mainMapStore.loadHub(hubId.value);
//   hubData.value = response.result;
// };

/** computed start */
const fieldSize = computed(() => {
  return {
    x: coordinateMax * 2,
    y: coordinateMax * 2,
  };
});

const listStyles = computed(() => {
  return {
    "--field-size-x": `${fieldSize.value.x}px`,
    "--field-size-y": `${fieldSize.value.y}px`,
  };
});

const innerStyles = computed(() => {
  return {
    "--shift-x": `${currentShift.value.x}px`,
    "--shift-y": `${currentShift.value.y}px`,
    "--cursor": isDragging.value ? "move" : "default",
    "--scaling": currentScaling.value,
  };
});

const spaceStyles = computed(() => {
  return {
    "--space-size-x": `${coordinateMax}px`,
    "--space-size-y": `${coordinateMax}px`,
    "--cell-size-x": `${cellSize}px`,
    "--cell-size-y": `${cellSize}px`,
  };
});

const rowLength = computed(() => {
  return coordinateMax / cellSize;
});
/** computed end */

const scrollEvent = (event: WheelEvent) => {
  let newCurrentScaling = currentScaling.value;
  if (event.deltaY > 0) {
    newCurrentScaling -= scalingStep;
  } else {
    newCurrentScaling += scalingStep;
  }
  if (newCurrentScaling > maxScaling || newCurrentScaling < minScaling) {
    return;
  }
  currentScaling.value = newCurrentScaling;
  // event.preventDefault();
  // event.stopPropagation();
};

const moveCameraCenter = () => {
  const x = -fieldSize.value.x / 2 + windowSizes.value.width / 2 + cellSize / 2;
  const y =
    -fieldSize.value.y / 2 + windowSizes.value.height / 2 + cellSize / 2;
  currentShift.value.x = x;
  currentShift.value.y = y;
  prevShift.x = x;
  prevShift.y = y;
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

    if (
      newShiftX > windowSizes.value.width - fieldSize.value.x - cameraLimit &&
      newShiftX < cameraLimit
    ) {
      currentShift.value.x = newShiftX;
    }

    if (
      newShiftY > windowSizes.value.height - fieldSize.value.y - cameraLimit &&
      newShiftY < cameraLimit
    ) {
      currentShift.value.y = newShiftY;
    }
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
.hub__page {
  position: relative;
  width: var(--field-size-x);
  height: var(--field-size-y);
  transition: all 0.2s ease-out;
  cursor: var(--cursor);
  background-image: url("/img/sky_2.avif");

  &-inner {
    position: absolute;
    width: var(--field-size-x);
    height: var(--field-size-y);
    // left: var(--shift-x);
    // top: var(--shift-y);
    transform: translate(var(--shift-x), var(--shift-y)) scale(var(--scaling));
    backdrop-filter: blur(10px);
    color: black;

    &-space {
      position: relative;
      width: var(--space-size-x);
      height: var(--space-size-y);
      display: block;

      &-row {
        display: flex;

        &-cell {
          width: var(--cell-size-x);
          height: var(--cell-size-y);
          border: 1px solid grey;
          color: white;
        }
      }
    }
  }

  &-coordinates {
    z-index: 11;
    position: fixed;
    bottom: 10px;
    left: 220px;
    color: white;
    backdrop-filter: blur(20px);
  }

  &-windows__size {
    z-index: 11;
    position: fixed;
    bottom: 10px;
    left: 400px;
    color: white;
    backdrop-filter: blur(20px);
  }

  &-extra {
    z-index: 11;
    position: fixed;
    bottom: 10px;
    left: 650px;
    color: white;
    backdrop-filter: blur(20px);
  }

  &-scale {
    z-index: 11;
    position: fixed;
    bottom: 10px;
    left: 1000px;
    color: white;
    backdrop-filter: blur(20px);
  }
}
</style>
