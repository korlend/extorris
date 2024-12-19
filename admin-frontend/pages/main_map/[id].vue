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
      <MainMap :depth="15" :hexagon-size="80" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import MainMap from "~/components/blocks/game/MainMap.vue";

import { useMainMapStore } from "@/store/main_map";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import MittEvents from "~/core/enums/MittEvents";

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
});

const mainMapFilters = computed(() => {
  const filters: { [key: string]: any } = {};
  if (currentIterationId.value) {
    filters.iteration_id = currentIterationId.value;
  }
  return filters;
});

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
