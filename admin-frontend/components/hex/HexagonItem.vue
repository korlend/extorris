<template>
  <div
    class="hexagon-item"
    :class="{ active: isActive }"
    :style="styles"
    @click="hexClick">
    <span class="hexagon-item-text">
      {{ `${depth}-${itemNumber}` }}
    </span>
    <!-- <span class="hexagon-item-portal top__left"> </span>
    <span class="hexagon-item-portal top__right"> </span>
    <span class="hexagon-item-portal right"> </span>
    <span class="hexagon-item-portal bottom__right"> </span>
    <span class="hexagon-item-portal bottom__left"> </span>
    <span class="hexagon-item-portal left"> </span> -->
  </div>
</template>

<script setup lang="ts">
import { useMainMapStore } from "@/store/main_map";
import type HexCoordinates from "~/core/interfaces/HexCoordinates";
import MittEvents from "~/core/enums/MittEvents";

const { $mittEmit, $mittOn } = useNuxtApp();

const props = defineProps({
  size: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    required: true,
  },
  itemNumber: {
    type: Number,
    required: true,
  },
  color: {
    type: Object,
    required: true,
  },
});

const mainMapStore = useMainMapStore();

let timeout: NodeJS.Timeout | null = null;

const isActive: Ref<boolean> = ref(false);

onMounted(() => {
  $mittOn(MittEvents.MAIN_MAP_PING, () => {
    const pings = mainMapStore.getPings;
    const itemDepth =
      typeof props.depth === "number" ? props.depth : parseInt(props.depth);
    const itemNumber =
      typeof props.itemNumber === "number"
        ? props.itemNumber
        : parseInt(props.itemNumber);
    if (
      !timeout &&
      pings[itemDepth] &&
      pings[itemDepth][itemNumber] &&
      pings[itemDepth][itemNumber].active
    ) {
      isActive.value = true;
      timeout = setTimeout(() => {
        isActive.value = false;
        mainMapStore.deletePing(itemDepth, itemNumber);
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = null;
      }, 2000);
    }
  });
});

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});

const styles = computed(() => {
  return {
    "--size": `${props.size - 2}px`,
    "--color": `rgb(${props.color.r},${props.color.g},${props.color.b})`,
  };
});

const hexClick = () => {
  // mainMapStore.createPing(props.depth, props.itemNumber);
  const nearbyCoordinates: Array<HexCoordinates> = [
    getHexCoordinatesTopLeft(props.depth, props.itemNumber),
    getHexCoordinatesTopRight(props.depth, props.itemNumber),
    getHexCoordinatesRight(props.depth, props.itemNumber),
    getHexCoordinatesBottomRight(props.depth, props.itemNumber),
    getHexCoordinatesBottomLeft(props.depth, props.itemNumber),
    getHexCoordinatesLeft(props.depth, props.itemNumber),
  ];

  for (let i = 0; i < nearbyCoordinates.length; i++) {
    const coordinates = nearbyCoordinates[i];
    mainMapStore.createPing(coordinates.itemDepth, coordinates.itemNumber);
  }
};
</script>

<style lang="scss" scoped>
@keyframes flashing {
  from {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0.6;
  }
}

.hexagon-item {
  position: relative;
  width: var(--size);
  height: var(--size);
  background-color: var(--color);
  // clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  // clip-path: polygon();
  // border: 1px solid red;
  opacity: 0.6;

  &:hover {
    // background-color: coral;
    z-index: 10;
    opacity: 1;
  }

  &.active {
    animation: flashing 0.5s ease infinite;
  }

  &-text {
    display: block;
    text-align: center;
    line-height: var(--size);
    color: white;
    width: 100%;
  }

  &-portal {
    position: absolute;
    width: 10%;
    height: 20%;
    background-color: azure;

    &.top__left {
      transform: translate(240%, -450%) rotate(330deg);
    }

    &.top__right {
      transform: translate(660%, -450%) rotate(30deg);
    }

    &.right {
      transform: translate(850%, -300%) rotate(90deg);
    }

    &.bottom__right {
      transform: translate(660%, -150%) rotate(150deg);
    }

    &.bottom__left {
      transform: translate(240%, -150%) rotate(210deg);
    }

    &.left {
      transform: translate(50%, -300%) rotate(270deg);
    }
  }
}
</style>
