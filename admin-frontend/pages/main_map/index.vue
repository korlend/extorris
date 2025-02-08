<template>
  <div class="main__map">
    <span class="main__map-selectors">
      <div class="main__map-selectors-row">
        <InputsEntityList
          v-model="currentIterationId"
          class="main__map-generation-input"
          @update:model-value="selectIteration"
          label="Iteration"
          entity="iteration">
          <template #extra_data="dataProps">
            {{ `active: ${dataProps.item.active}` }}
          </template>
        </InputsEntityList>
        <InputsEntityList
          class="main__map-generation-input"
          :filters="mainMapFilters"
          @update:model-value="selectMainMap"
          label="Main map"
          entity="main_map"></InputsEntityList>
      </div>
      <div class="main__map-selectors-row"></div>
    </span>
    <span class="main__map-generation">
      <div class="main__map-generation-row">
        <InputsNumber
          class="main__map-generation-input"
          label="layerAmount"
          v-model="layerAmount"></InputsNumber>
        <InputsNumber
          class="main__map-generation-input"
          label="mapDepth"
          v-model="mapDepth"></InputsNumber>
        <InputsNumber
          class="main__map-generation-input"
          label="treesDepthStart"
          v-model="treesDepthStart"></InputsNumber>
      </div>
      <div class="main__map-generation-row">
        <InputsDatePicker
          class="main__map-generation-input"
          label="startDate"
          v-model="startDate"></InputsDatePicker>
        <InputsDatePicker
          class="main__map-generation-input"
          label="endDate"
          v-model="endDate"></InputsDatePicker>
      </div>
      <div class="main__map-generation-buttons">
        <v-btn @click.stop="generateIteration" color="success">Generate</v-btn>
      </div>
    </span>
    <client-only>
      <CanvasComponent
        :draw-function="draw"
        :canvas-blocks="canvasBlocks"></CanvasComponent>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useMainMapStore } from "@/store/main_map";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import MittEvents from "~/core/enums/MittEvents";

import {
  CanvasComponent,
  CanvasCursors,
  type CanvasBlock,
  type CanvasClickEvent,
  type CanvasDrawOptions,
  type CanvasElement,
  type Vector2D,
} from "extorris-common";

const { $mittEmit } = useNuxtApp();

const router = useRouter();
const mainMapStore = useMainMapStore();

const layerAmount: Ref<number> = ref(1);
const mapDepth: Ref<number> = ref(5);
const treesDepthStart: Ref<number> = ref(0);
const startDate: Ref<Date | undefined> = ref();
const endDate: Ref<Date | undefined> = ref();

const currentIterationId: Ref<number | string | null> = ref(0);

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

const loadedMainMap: Ref<Record<string, any> | null> = ref(null);

onMounted(async () => {
  resetCanvasBlock();
});

const mainMapFilters = computed(() => {
  const filters: { [key: string]: any } = {};
  if (currentIterationId.value) {
    filters.iteration_id = currentIterationId.value;
  }
  return filters;
});

const mappedPortalsByHubId = computed(() => {
  const mainMap = loadedMainMap.value;
  const mappedPortals: { [key: number]: Array<Record<string, any>> } = {};
  if (!mainMap) {
    return mappedPortals;
  }

  for (let i = 0; i < mainMap.portals.length; i++) {
    const portal = mainMap.portals[i];
    if (!mappedPortals[portal.from_hub_id]) {
      mappedPortals[portal.from_hub_id] = [];
    }
    mappedPortals[portal.from_hub_id].push(portal);
  }

  return mappedPortals;
});

const mappedHubsByHubId = computed(() => {
  const mainMap = loadedMainMap.value;
  const mappedHubs: { [key: number]: Record<string, any> } = {};
  if (!mainMap) {
    return mappedHubs;
  }

  for (let i = 0; i < mainMap.mainMapHubs.length; i++) {
    const hub = mainMap.mainMapHubs[i];
    mappedHubs[hub.id] = hub;
  }

  return mappedHubs;
});

const resetCanvasBlock = (iteration?: any) => {
  const hexSize = 100;
  const hexYOffset = 25;
  const hexGap = 2;

  canvasBlocks.value = [];
  if (!loadedMainMap.value) {
    return;
  }

  const hex = getHexagon(hexSize, hexYOffset, hexGap);

  const newCanvasBlocks: Array<CanvasBlock> = [];

  for (let i = 0; i < loadedMainMap.value.mainMapHubs.length; i++) {
    const hub = loadedMainMap.value.mainMapHubs[i];
    const pos = calcPos(hub.hub_number, hub.on_depth, hexSize);
    const portals = mappedPortalsByHubId.value[hub.id];

    const portalLines: Array<CanvasElement> = [];
    if (portals?.length) {
      for (let j = 0; j < portals.length; j++) {
        const portal = portals[j];
        const linkedHub = mappedHubsByHubId.value[portal.to_hub_id];
        const linkedHubPos = calcPos(
          linkedHub.hub_number,
          linkedHub.on_depth,
          hexSize
        );
        // console.log(`hub[${hub.on_depth}-${hub.hub_number}]`, pos.x, pos.y, `linkedHub[${linkedHub.on_depth}-${linkedHub.hub_number}]`, linkedHubPos.x, linkedHubPos.y)
        // portalLines.push({
        //   path: getLine(pos, linkedHubPos),
        //   color: `rgb(50,250,250)`,
        // });
        newCanvasBlocks.push({
          zindex: 1,
          position: pos,
          stroke: [
            {
              path: getLine(
                { x: 0, y: 0 },
                { x: linkedHubPos.x - pos.x, y: linkedHubPos.y - pos.y }
              ),
              color: `rgb(250,0,0)`,
            },
          ],
        });
      }
    }

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
        router.push({
          path: `/main_map/hub/${hub.id}`,
          // params: {
          //   id: hub.id,
          // },
        });
      },
    });
  }

  canvasBlocks.value = newCanvasBlocks;
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

const getHalfEllipse = (radius: number): Path2D => {
  const halfEllipse = new Path2D();
  // halfEllipse.arc(0, 0, radius, Math.PI, 0, true)
  halfEllipse.ellipse(0, 0, radius, radius * 0.7, Math.PI / 2, 0, Math.PI);
  return halfEllipse;
};

const getLine = (start: Vector2D, end: Vector2D): Path2D => {
  const line = new Path2D();
  line.moveTo(start.x, start.y);
  line.lineTo(end.x, end.y);
  return line;
};

const draw = (
  context: CanvasRenderingContext2D,
  options: CanvasDrawOptions
) => {};

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

  return { x: Math.floor(x), y: Math.floor(y) };
};

const loadMainMap = async (mainMapId: number | string) => {
  if (!mainMapId) {
    return null;
  }
  const mainMap = await mainMapStore.loadMainMap(mainMapId);
  return mainMap;
};

const checkGenerationParams = () => {
  let noError = true;
  if (layerAmount.value <= 0) {
    createAlert("layerAmount should be greater than 0", LocalAlertTypes.ERROR);
    noError = false;
  }
  if (mapDepth.value <= 0) {
    createAlert("mapDepth should be greater than 0", LocalAlertTypes.ERROR);
    noError = false;
  }
  return noError;
};

const generateIteration = async () => {
  if (!checkGenerationParams()) {
    return;
  }
  const generateResponse = await mainMapStore.generateIteration(
    layerAmount.value,
    mapDepth.value,
    treesDepthStart.value,
    startDate.value,
    endDate.value
  );
  $mittEmit(MittEvents.RELOAD_ENTITY_AUTOCOMPLETE);
  createAlert(
    `created new iteration, ${generateResponse.result?.id}`,
    LocalAlertTypes.SUCCESS
  );
};

const selectIteration = (iterationId: number | string | null) => {
  currentIterationId.value = iterationId;
};

const selectMainMap = async (mainMapId: number | string | null) => {
  if (!mainMapId) {
    return;
  }
  loadedMainMap.value = await loadMainMap(mainMapId);
  resetCanvasBlock();
};

const openModal = () => {
  openModalWindow({});
};
</script>

<style lang="scss" scoped>
.main__map {
  &-selectors {
    position: fixed;
    top: 60px;
    left: 200px;
    z-index: 100;
    width: calc(50% - 150px);
    padding-left: 20px;

    &-row {
      display: flex;
    }
  }

  &-generation {
    position: fixed;
    top: 60px;
    right: 50px;
    z-index: 100;
    width: calc(50% - 150px);

    &-row {
      display: flex;
    }

    &-buttons {
      display: flex;
      justify-content: end;
    }

    &-input {
      padding: 0 10px;
    }
  }
}
</style>
