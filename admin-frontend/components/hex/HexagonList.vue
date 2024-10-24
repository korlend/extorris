<template>
  <div v-once class="hexagon-list" :style="listStyles">
    <div class="counter">
      {{ counter }}
    </div>
    <div v-for="cDepth in depthArray" :key="cDepth">
      <div
        v-for="itemNumber in itemsArrays.get(cDepth)"
        :key="getLevelAndItemKey(cDepth, itemNumber)"
      >
        <HexagonItem
          :size="props.hexagonSize"
          :depth="cDepth"
          :item-number="itemNumber"
          :style="hexItemStyles.get(getLevelAndItemKey(cDepth, itemNumber))"
          :color="depthArrayColors[cDepth]"
          class="hexagon-list__item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HexagonItem from "~/components/hex/HexagonItem.vue";

const props = defineProps({
  depth: {
    type: Number,
    required: true,
  },
  hexagonSize: {
    type: Number,
    required: true,
  },
  fieldSize: {
    type: Object,
    required: true,
  },
});

onBeforeMount(() => {
  for (let i = 0; i < props.depth; i++) {
    depthArray.value.push(i);
    depthArrayColors.value.push(getColor());
    const itemsArray = getItemsCountArray(i);
    itemsArrays.value.set(i, itemsArray);
    for (let j = 0; j < itemsArray.length; j++) {
      hexItemStyles.value.set(getLevelAndItemKey(i, j), getHexItemStyles(j, i));
    }
  }
});

onBeforeUnmount(() => {});

onServerPrefetch(() => {
  for (let i = 0; i < props.depth; i++) {
    depthArray.value.push(i);
  }
});

/** refs start */
const counter: Ref<number> = ref(0);
const depthArray: Ref<Array<number>> = ref([]);
const depthArrayColors: Ref<Array<{ r: number; g: number; b: number }>> = ref(
  [],
);
const itemsArrays: Ref<Map<number, Array<number>>> = ref(new Map());
const hexItemStyles: Ref<Map<string, { top: string; left: string }>> = ref(
  new Map(),
);
/** refs end */

/** computed start */
const listStyles = computed(() => {
  return {
    "--field-size-x": `${props.fieldSize.x}px`,
    "--field-size-y": `${props.fieldSize.y}px`,
  };
});
/** computed end */

// use it in a template too?
const getLevelAndItemKey = (level: number, itemNumber: number) => {
  // console.log('RERENDER', (new Date()).getTime());
  counter.value = counter.value + 1;
  return `${level}-${itemNumber}`;
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getColor = () => {
  return {
    r: getRandomInt(256),
    g: getRandomInt(256),
    b: getRandomInt(256),
  };
};

const getItemsCountArray = (depth: number): Array<number> => {
  const size = depth * 6 || 1;
  const itemsCountArray = [];

  for (let i = 0; i < size; i++) {
    itemsCountArray.push(i);
  }

  return itemsCountArray;
};

const getHexItemStyles = (itemNumber: number, level: number) => {
  const positions = calcPos(itemNumber, level);

  return {
    top: `${positions.y}px`,
    left: `${positions.x}px`,
  };
};

const calcPos = (
  itemNumber: number,
  level: number,
): { x: number; y: number } => {
  let x: number = 0,
    y: number = 0;

  const hexagonSize = props.hexagonSize;
  const initialPositionX = props.fieldSize.x / 2 - hexagonSize;
  const initialPositionY = props.fieldSize.y / 2 - hexagonSize;

  const isTopRow = itemNumber >= 0 && itemNumber <= level;
  const isRightRow = itemNumber > level && itemNumber < level * 3;
  const isBottomRow = itemNumber >= level * 3 && itemNumber <= level * 4;
  const isLeftRow = itemNumber > level * 4;

  if (level == 0) {
    return { x: initialPositionX, y: initialPositionY };
  }

  if (isTopRow) {
    const initialX = initialPositionX - level * hexagonSize * 0.5;
    x = initialX + itemNumber * hexagonSize;
    y = initialPositionY - level * hexagonSize * 0.75;
  } else if (isBottomRow) {
    const initialX = initialPositionX + 0.5 * level * hexagonSize;
    const localItemNumber = itemNumber - level * 3;
    x = initialX - localItemNumber * hexagonSize;
    y = initialPositionY + level * hexagonSize * 0.75;
  } else if (isRightRow) {
    const isIncreasing = itemNumber < level * 2;
    const isDecreasing = itemNumber > level * 2;
    if (isIncreasing) {
      const initialX =
        initialPositionX + hexagonSize + (level - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY - level * hexagonSize * 0.75;
      const localItemNumber = itemNumber - level;
      x = initialX + (localItemNumber - 1) * hexagonSize * 0.5;
      y = initialY + localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX + hexagonSize + (level - 1) * hexagonSize;
      const localItemNumber = itemNumber - level * 2;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialPositionY + localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX + level * hexagonSize;
      y = initialPositionY;
    }
  } else if (isLeftRow) {
    const isIncreasing = itemNumber < level * 5;
    const isDecreasing = itemNumber > level * 5;
    if (isIncreasing) {
      const initialX =
        initialPositionX - hexagonSize * 0.5 - (level - 1) * hexagonSize * 0.5;
      const initialY = initialPositionY + level * hexagonSize * 0.75;
      const localItemNumber = itemNumber - level * 4;
      x = initialX - localItemNumber * hexagonSize * 0.5;
      y = initialY - localItemNumber * hexagonSize * 0.75;
    } else if (isDecreasing) {
      const initialX =
        initialPositionX - hexagonSize - (level - 1) * hexagonSize;
      const localItemNumber = itemNumber - level * 5;
      x = initialX + localItemNumber * hexagonSize * 0.5;
      y = initialPositionY - localItemNumber * hexagonSize * 0.75;
    } else {
      x = initialPositionX - level * hexagonSize;
      y = initialPositionY;
    }
  }

  return { x: Math.floor(x), y: Math.floor(y) };
};
</script>

<style lang="scss" scoped>
.counter {
  position: absolute;
  top: 100px;
  left: 100px;
  color: white;
}
.hexagon-list {
  &__item {
    position: absolute;
  }
}
</style>
