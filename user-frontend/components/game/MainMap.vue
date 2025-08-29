<template>
  <div class="hub__page">
    <CanvasComponent :canvas-blocks="canvasBlocks"></CanvasComponent>
  </div>
</template>

<script setup lang="ts">
import {
  Vector2D,
  CanvasComponent,
  type CanvasBlock,
  CanvasCursors,
} from "extorris-common";
import { extendRouteRules } from "nuxt/kit";
import {
  useMainMapStore,
  type Hub,
  type MainMap,
  type Portal,
} from "~/store/main_map";

const router = useRouter();

const mainMapStore = useMainMapStore();

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

const currentMap: Ref<MainMap | null> = ref(null);

onBeforeMount(() => {});

onMounted(async () => {
  const data = await mainMapStore.loadIteration();
  console.log(data);
  if (data.maps?.length) {
    currentMap.value = data.maps[0];
  }
  requestAnimationFrame(resetCanvasBlock);

  // for (let depth = 0; depth < maxDepth; depth++) {
  //   const maxHubNumber = depth * 6 || 1;
  //   for (let hubNumber = 0; hubNumber < maxHubNumber; hubNumber++) {
  //     const pos = calcPos(hubNumber, depth, hexSize);
  //     const hex = getHexagon(hexSize, hexYOffset, hexGap);
  //     canvasBlocks.value.push({
  //       zindex: 0,
  //       position: pos,
  //       fill: [
  //         {
  //           path: hex,
  //           color: `rgb(150,150,150)`,
  //         },
  //       ],
  //       hoverWhen: [hex],
  //       hoverChange: {
  //         cursor: CanvasCursors.POINTER,
  //         fill: [
  //           {
  //             path: hex,
  //             color: `rgb(255,255,255)`,
  //           },
  //         ],
  //       },
  //     });
  //   }
  // }
});

onBeforeUnmount(() => {});

const getIteration = computed(() => {
  return mainMapStore.getIteration;
});

const getAllMaps = computed(() => {
  return mainMapStore.getMaps;
});

const getAllHubs = computed(() => {
  return mainMapStore.getHubs;
});

const getAllPortals = computed(() => {
  return mainMapStore.getPortals;
});

const getCurrentMapHubs = computed(() => {
  const allHubs = getAllHubs.value;
  const map = currentMap.value;
  if (!map) {
    return [];
  }
  const currentMapHubs = allHubs.filter((hub) => hub.main_map_id === map.id);
  return currentMapHubs || [];
});

const getMappedCurrentMapHubs = computed(() => {
  const currentMapHubs = getCurrentMapHubs.value;
  const mappedHubs: Record<string, Hub> = {};
  for (let i = 0; i < currentMapHubs.length; i++) {
    const hub = currentMapHubs[i];
    mappedHubs[hub.id] = hub;
  }
  return mappedHubs || {};
});

const getCurrentMapPortals = computed(() => {
  const allPortals = getAllPortals.value;
  const mappedHubs = getMappedCurrentMapHubs.value;
  const currentMapPortals = allPortals.filter(
    (portal) =>
      !!mappedHubs[portal.from_hub_id] || !!mappedHubs[portal.to_hub_id]
  );
  return currentMapPortals || [];
});

const getHubIdMappedCurrentMapPortals = computed(() => {
  const currentMapPortals = getCurrentMapPortals.value;
  const mappedPortals: Record<string, Array<Portal>> = {};
  for (let i = 0; i < currentMapPortals.length; i++) {
    const portal = currentMapPortals[i];
    if (!mappedPortals[portal.from_hub_id]) {
      mappedPortals[portal.from_hub_id] = [portal];
    } else {
      mappedPortals[portal.from_hub_id].push(portal);
    }
    if (!mappedPortals[portal.to_hub_id]) {
      mappedPortals[portal.to_hub_id] = [portal];
    } else {
      mappedPortals[portal.to_hub_id].push(portal);
    }
  }
  return mappedPortals;
});

const resetCanvasBlock = () => {
  const hexSize = 100;
  const hexYOffset = 25;
  const hexGap = 2;

  canvasBlocks.value = [];

  const hex = getHexagon(hexSize, hexYOffset, hexGap);

  const newCanvasBlocks: Array<CanvasBlock> = [];
  const hubs = getCurrentMapHubs.value;
  const hubIdMappedHubs = getMappedCurrentMapHubs.value;
  const hubIdMappedPortals = getHubIdMappedCurrentMapPortals.value;

  console.log(hubs, hubIdMappedHubs, hubIdMappedPortals);

  for (let i = 0; i < hubs.length; i++) {
    const hub = hubs[i];
    const pos = calcPos(hub.hub_number, hub.on_depth, hexSize);
    const portals = hubIdMappedPortals[hub.id];

    // drawing portals lines
    for (let j = 0; j < portals.length; j++) {
      const portal = portals[j];
      const linkedHub = hubIdMappedHubs[portal.to_hub_id];
      if (!linkedHub) {
        continue;
      }
      const linkedHubPos = calcPos(
        linkedHub.hub_number,
        linkedHub.on_depth,
        hexSize
      );
      newCanvasBlocks.push({
        zindex: 1,
        position: pos,
        stroke: [
          {
            path: getLine(
              new Vector2D(0, 0),
              new Vector2D(linkedHubPos.x - pos.x, linkedHubPos.y - pos.y)
            ),
            color: `rgb(250,0,0)`,
          },
        ],
      });
    }

    // drawing hubs
    newCanvasBlocks.push({
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
        // stroke: [...portalLines],
      },
      clickCallback: () => {
        jumpToHub(hub.id);
      },
    });
  }

  canvasBlocks.value = newCanvasBlocks;
};

const jumpToHub = (hubId: number) => {
  router.push({
    name: "hub-id",
    params: {
      id: hubId,
    },
  });
};

const getLine = (start: Vector2D, end: Vector2D): Path2D => {
  const line = new Path2D();
  line.moveTo(start.x, start.y);
  line.lineTo(end.x, end.y);
  return line;
};

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
    return new Vector2D(initialPositionX, initialPositionY);
  }

  if (isTopRow) {
    const initialX = initialPositionX - depth * hexagonSize * 0.5;
    x = initialX + itemNumber * hexagonSize;
    y = initialPositionY + depth * hexagonSize * 0.75;
  } else if (isBottomRow) {
    const initialX = initialPositionX + 0.5 * depth * hexagonSize;
    const localItemNumber = itemNumber - depth * 3;
    x = initialX - localItemNumber * hexagonSize;
    y = initialPositionY - depth * hexagonSize * 0.75;
  } else if (isRightRow) {
    const isIncreasing = itemNumber < depth * 2;
    const isDecreasing = itemNumber > depth * 2;
    if (isIncreasing) {
      const initialX =
        initialPositionX + hexagonSize + (depth - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY + depth * hexagonSize * 0.75;
      const localItemNumber = itemNumber - depth;
      x = initialX + (localItemNumber - 1) * hexagonSize * 0.5;
      y = initialY - localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX + hexagonSize + (depth - 1) * hexagonSize;
      const localItemNumber = itemNumber - depth * 2;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialPositionY - localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX + depth * hexagonSize;
      y = -initialPositionY;
    }
  } else if (isLeftRow) {
    const isIncreasing = itemNumber < depth * 5;
    const isDecreasing = itemNumber > depth * 5;
    if (isIncreasing) {
      const initialX =
        initialPositionX - hexagonSize * 0.5 - (depth - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY - depth * hexagonSize * 0.75;
      const localItemNumber = itemNumber - depth * 4;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialY + localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX - hexagonSize - (depth - 1) * hexagonSize;
      const localItemNumber = itemNumber - depth * 5;
      x = initialX + localItemNumber * hexagonSize * 0.5;
      y = initialPositionY + localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX - depth * hexagonSize;
      y = -initialPositionY;
    }
  }

  return new Vector2D(Math.floor(x), Math.floor(y));
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
  width: 100%;
  height: 100%;
}
</style>
