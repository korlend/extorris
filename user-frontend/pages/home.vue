<template>
  <div class="home__page">
    <BlocksCanvasBlock
      class="home__page-canvas"
      :class="getClasses"
      :draw-function="draw"
      :draw-modal-function="drawModal"
      :canvas-blocks="canvasBlocks"
      @action:click="clickEvent"></BlocksCanvasBlock>
  </div>
</template>

<script setup lang="ts">
import CanvasCursors from "~/core/enums/CanvasCursors";
import type CanvasBlock from "~/core/interfaces/canvas/CanvasBlock";
import type CanvasClickEvent from "~/core/interfaces/canvas/CanvasClickEvent";
import type DrawOptions from "~/core/interfaces/canvas/DrawOptions";
import {
  useModalWindowStore,
  type ModalWindowData,
} from "@/store/modal_window";

import ShipyardMenu from "~/components/game/ShipyardMenu.vue";
import { useHomeIslandStore } from "~/store/home_island";

const modalWindowStore = useModalWindowStore();
const homeIslandStore = useHomeIslandStore()

const mouseOnClickable: Ref<boolean> = ref(false);

let isMenuOpen: boolean = false;

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

onBeforeMount(async () => {
  await homeIslandStore.loadHomeIslandInfo();
});

onMounted(() => {
  /*
  for showing portals on main map
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  */
  const shipyard = getBuilding();
  canvasBlocks.value.push(
    {
      zindex: 0,
      fill: [
        {
          path: getOval(400, 1000),
          color: `rgb(70,150,70)`,
        },
      ],
    },
    {
      zindex: 1,
      position: { x: -1000, y: 0 },
      fill: [
        {
          path: shipyard.roof,
          color: `rgb(100,100,100)`,
        },
        {
          path: shipyard.wall,
          color: `rgb(100,100,100)`,
        },
      ],
      stroke: [
        {
          path: shipyard.roof,
          color: `rgb(200,200,200)`,
        },
        {
          path: shipyard.wall,
          color: `rgb(200,200,200)`,
        },
        {
          path: shipyard.window,
          color: `rgb(200,200,200)`,
        },
      ],
      hoverWhen: [shipyard.roof, shipyard.wall, shipyard.window],
      hoverChange: {
        fill: [
          {
            path: shipyard.window,
            color: `rgb(200,200,0)`,
          },
        ],
        cursor: CanvasCursors.POINTER,
      },
      clickCallback: buildingClicked,
    }
  );
});

const getClasses = computed(() => {
  const classes: Array<string> = [];
  if (mouseOnClickable.value) {
    classes.push("pointer");
  }
  return classes;
});

const buildingClicked = async (canvasEvent: CanvasClickEvent) => {
  const data: ModalWindowData = {
    component: ShipyardMenu,
  };
  modalWindowStore.openModal(data);
};

const getOval = (radiusX: number, radiusY: number): Path2D => {
  const circle = new Path2D();
  circle.ellipse(0, 0, radiusX, radiusY, Math.PI / 2, 0, 2 * Math.PI);
  return circle;
};

const getBuilding = (): {
  roof: Path2D;
  wall: Path2D;
  window: Path2D;
} => {
  const roof = new Path2D();
  roof.moveTo(-40, -40);
  roof.lineTo(-40, -60);
  roof.lineTo(0, -80);
  roof.lineTo(40, -60);
  roof.lineTo(40, -40);
  roof.lineTo(0, -60);
  roof.lineTo(-40, -40);
  roof.moveTo(0, -60);
  roof.lineTo(0, -80);

  const wall = new Path2D();
  wall.moveTo(-40, -60);
  wall.lineTo(-40, 25);
  wall.lineTo(40, 25);
  wall.lineTo(40, -60);

  const window = new Path2D();
  window.moveTo(-15, -30);
  window.lineTo(-15, 0);
  window.lineTo(15, 0);
  window.lineTo(15, -30);
  window.lineTo(-15, -30);

  return {
    roof,
    wall,
    window,
  };
};

const drawModal = (context: CanvasRenderingContext2D, options: DrawOptions) => {
  context.save();
  if (isMenuOpen) {
    const menu = new Path2D();
    menu.moveTo(-700, -300);
    menu.lineTo(700, -300);
    menu.lineTo(700, 300);
    menu.lineTo(-700, 300);
    menu.lineTo(-700, -300);

    context.fillStyle = `rgb(70, 70, 70)`;
    context.strokeStyle = `rgb(200, 200, 200)`;
    context.fill(menu);
    context.stroke(menu);
  }
  context.restore();
};

const draw = (context: CanvasRenderingContext2D, options: DrawOptions) => {};

const clickEvent = (canvasEvent: CanvasClickEvent) => {};
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

.home__page {
  &-canvas {
    // width: 100%;
    // height: 100%;
    // border: 1px solid grey;
  }
}
</style>
