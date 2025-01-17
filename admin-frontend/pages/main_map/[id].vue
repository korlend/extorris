<template>
  <div class="main__map">
    <span class="main__map-selectors">
      <div class="main__map-selectors-row">
        <InputsEntity
          v-model="currentIterationId"
          class="main__map-generation-input"
          @update:model-value="selectIteration"
          label="Select iteration"
          entity="iteration"></InputsEntity>
        <InputsEntity
          class="main__map-generation-input"
          :filters="mainMapFilters"
          @update:model-value="selectMainMap"
          label="Select main map"
          entity="main_map"></InputsEntity>
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
        <v-btn @click.stop="openModal" color="success">open modal</v-btn>
      </div>
    </span>
    <client-only>
      <BlocksCanvasBlock
        :draw-function="draw"
        :canvas-blocks="canvasBlocks"></BlocksCanvasBlock>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { useMainMapStore } from "@/store/main_map";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import MittEvents from "~/core/enums/MittEvents";
import type CanvasBlock from "~/core/interfaces/canvas/CanvasBlock";
import CanvasCursors from "~/core/enums/CanvasCursors";
import type DrawOptions from "~/core/interfaces/canvas/DrawOptions";
import type Vector2D from "~/core/interfaces/Vector2D";

const { $mittEmit } = useNuxtApp();

const router = useRouter();
const route = useRoute();
const mainMapStore = useMainMapStore();

const layerAmount: Ref<number> = ref(0);
const mapDepth: Ref<number> = ref(0);
const treesDepthStart: Ref<number> = ref(0);
const startDate: Ref<Date | undefined> = ref();
const endDate: Ref<Date | undefined> = ref();

const currentIterationId: Ref<number> = ref(0);

const canvasBlocks: Ref<Array<CanvasBlock>> = ref([]);

watch(
  () => route,
  (newRoute) => {
    currentIterationId.value = parseInt(newRoute.params.id as string);
    loadIteration();
  }
);

onMounted(async () => {
  currentIterationId.value = parseInt(route.params.id as string);
  await loadIteration();

  const maxDepth = 30;

  const hexSize = 100;
  const hexYOffset = 25;
  const hexGap = 2;

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

const mainMapFilters = computed(() => {
  const filters: { [key: string]: any } = {};
  if (currentIterationId.value) {
    filters.iteration_id = currentIterationId.value;
  }
  return filters;
});

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

const loadIteration = async () => {
  if (!currentIterationId.value) {
    return;
  }
  const iteration = await mainMapStore.loadIteration(currentIterationId.value);
  console.log("loaded iteration: ", iteration);
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
  console.log("generated iteration: ", generateResponse);
};

const selectIteration = (iterationId?: number) => {
  router.push(`/main_map/${iterationId}`);
};

const selectMainMap = (mainMapId?: number) => {
  console.log(mainMapId);
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
