<template>
  <div class="hub__page">
    <div class="fps">
      {{ fpsArray.length }}
    </div>
    <div class="controls">
      <span>speed: {{ shipData.speed }}</span>
      <span>angle: {{ shipData.angle }}</span>
      <v-btn @click="increaseSpeed">Increase speed</v-btn>
      <v-btn @click="decreaseSpeed">Decrease speed</v-btn>
      <v-btn @click="increaseAngle">Increase angle</v-btn>
      <v-btn @click="decreaseAngle">Decrease angle</v-btn>
    </div>
    <canvas
      class="hub__page-canvas"
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @wheel="scrollEvent"
      @mousedown.prevent.stop="dragStart"
      @mousemove="mouseMove">
      <div>loading</div>
    </canvas>
  </div>
</template>

<script setup lang="ts">
const canvasRef = useTemplateRef("canvasRef");

const maxCoordinates = 10000;
const canvasHeight = maxCoordinates;
const canvasWidth = maxCoordinates;

let rendering = true;
let lastRedrawTime = new Date();

let context: CanvasRenderingContext2D | null | undefined;

const cellSize = 500;

const dragDelay = 50;

let currentScaling = 1;
const maxScaling = 1;
const minScaling = 0.1;
const scalingStep = 0.1;
const floorScaling = 100;

let fpsArray: Ref<Array<Date>> = ref([]);

let draggingStartPosX: number = 0;
let draggingEndPosX: number = 0;
let draggingStartPosY: number = 0;
let draggingEndPosY: number = 0;

const isDragging: Ref<boolean> = ref(false);
const prevShift: { x: number; y: number } = { x: 0, y: 0 };
const currentShift: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 });

const shipImage = new Image();

const speedStep = 10;
const rotateStep = 5;

const shipData = ref({
  x: 500,
  y: 500,
  speed: 0,
  angle: 45,
  acceleration: 0,
});

onBeforeMount(() => {});

onBeforeUnmount(() => {
  rendering = false;
  window.removeEventListener("mousemove", dragEvent, true);
  window.removeEventListener("touchmove", dragEvent, true);
});

onMounted(() => {
  console.log("onMounted test hub");
  shipImage.src = "http://localhost:8090/images/default_ship.png";
  /*
  for showing portals on main map
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  */

  // window.addEventListener("mousemove", throttle(dragEvent, dragDelay));
  // window.addEventListener("touchmove", throttle(dragEvent, dragDelay));
  window.addEventListener("mousemove", dragEvent);
  window.addEventListener("touchmove", dragEvent);

  context = canvasRef.value?.getContext("2d");
  if (context !== null && context !== undefined) {
    requestAnimationFrame(() => redraw(context));
  }
});

const getBackground = (): Path2D => {
  const background = new Path2D();
  for (let i = 0; i <= maxCoordinates; i = i + cellSize) {
    background.moveTo(0, i);
    background.lineTo(maxCoordinates, i);
  }
  for (let i = 0; i <= maxCoordinates; i = i + cellSize) {
    background.moveTo(i, 0);
    background.lineTo(i, maxCoordinates);
  }
  return background;
};

const getShip = (): Path2D => {
  const ship = new Path2D();
  ship.moveTo(0, 50);
  ship.lineTo(30, 70);
  ship.lineTo(80, 70);
  ship.lineTo(80, 30);
  ship.lineTo(30, 30);
  return ship;
};

const redraw = (context?: CanvasRenderingContext2D | null) => {
  if (!context) {
    return;
  }
  const time = new Date();

  /* transform and clear */
  // context.fillStyle = `rgb(0,0,0)`;
  context.setTransform(
    currentScaling,
    0,
    0,
    currentScaling,
    currentShift.value.x,
    currentShift.value.y
  );
  const clearNumber = maxCoordinates * maxCoordinates;
  context.clearRect(
    -clearNumber,
    -clearNumber,
    clearNumber + clearNumber,
    clearNumber + clearNumber
  );
  /* */

  // background
  context.save();
  context.strokeStyle = `rgb(255,255,255)`;
  context.stroke(getBackground());
  context.restore();

  // ship
  if (shipImage.complete) {
    const { width, height } = shipImage;
    recalculateShipPosition(time, lastRedrawTime);
    context.save();
    context.fillStyle = `rgb(102,255,51)`;
    context.translate(shipData.value.x, shipData.value.y);
    context.rotate((shipData.value.angle * Math.PI) / 180);
    context.scale(0.5, 0.5);
    // const ship = getShip();
    // context.fill(ship);
    context.drawImage(shipImage, -width / 2, -height / 2);
    context.restore();
  }

  fpsArray.value.push(new Date());
  lastRedrawTime = time;
  fpsArray.value = fpsArray.value.filter(
    (v) => v.getTime() > time.getTime() - 1000
  );
  if (rendering) {
    requestAnimationFrame(() => redraw(context));
  }
};

const recalculateShipPosition = (currentTime: Date, previousTime: Date) => {
  const { angle, speed } = shipData.value;
  if (!speed) {
    return;
  }
  const one_rad = 180 / Math.PI;
  const radians = angle / one_rad;
  const sin = Math.sin(radians);
  const r = speed / (currentTime.getTime() - previousTime.getTime());
  let sk1 = sin * r;
  let sk2 = Math.sqrt(Math.pow(r, 2) - Math.pow(sk1, 2));
  if (angle > 90 && angle < 270) {
    shipData.value.x += sk1;
    shipData.value.y += sk2;
  } else {
    shipData.value.x += sk1;
    shipData.value.y -= sk2;
  }
  // console.log(
  //   currentTime.getTime() - previousTime.getTime(),
  //   speed / (currentTime.getTime() - previousTime.getTime())
  // );
  // console.log("angle:", angle, "speed:", speed, "radians:", radians);
  // console.log("sin:", sin, "asin:", asin);
  // console.log("r:", r, "sk1:", sk1, "sk2:", sk2);
  // console.log("r:", r, "ck1:", ck1, "ck2:", ck2);
  // console.log("r:", r, "tk1:", tk1, "tk2:", tk2);
  // console.log("r:", r, "ctk1:", ctk1, "ctk2:", ctk2);
};

const increaseSpeed = () => {
  shipData.value.speed += speedStep;
};

const decreaseSpeed = () => {
  const newSpeed = shipData.value.speed - speedStep;
  if (newSpeed < 0) {
    return;
  }
  shipData.value.speed = newSpeed;
};

const increaseAngle = () => {
  if (shipData.value.angle >= 360) {
    shipData.value.angle = rotateStep;
    return;
  }
  shipData.value.angle += rotateStep;
};

const decreaseAngle = () => {
  if (shipData.value.angle <= 0) {
    shipData.value.angle = 360 - rotateStep;
    return;
  }
  shipData.value.angle -= rotateStep;
};

const mouseMove = (event: any) => {
  // let x = 0;
  // let y = 0;
  // if (event instanceof MouseEvent) {
  //   x = event.x;
  //   y = event.y;
  // } else if (event instanceof TouchEvent) {
  //   x = event?.touches?.[0].clientX;
  //   y = event?.touches?.[0].clientY;
  // }
  // console.log(x, y);
  // console.log(event.layerX, event.layerY);
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

  console.log(currentScaling);
  // event.preventDefault();
  // event.stopPropagation();
};

const dragStart = (event: MouseEvent | TouchEvent) => {
  console.log("dragStart");
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

    // if (
    //   newShiftX > windowSizes.value.width - fieldSize.value.x - cameraLimit &&
    //   newShiftX < cameraLimit
    // ) {
    //   currentShift.value.x = newShiftX;
    // }

    // if (
    //   newShiftY > windowSizes.value.height - fieldSize.value.y - cameraLimit &&
    //   newShiftY < cameraLimit
    // ) {
    //   currentShift.value.y = newShiftY;
    // }
  }
};
</script>

<style lang="scss" scoped>
.fps {
  position: fixed;
  top: 60px;
  left: 210px;
  color: white;
}

.controls {
  position: fixed;
  bottom: 0px;
  left: 210px;
  width: 100%;
  height: 50px;

  & > * {
    margin: 0px 10px;
  }
}

.hub__page {
  &-canvas {
    // width: 100%;
    // height: 100%;
    border: 1px solid grey;
  }
}
</style>
