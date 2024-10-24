<template>
  <div class="hexagon-item" :style="styles">
    {{ `${depth}-${itemNumber}` }}
  </div>
</template>

<script setup lang="ts">
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

onMounted(() => {
  // console.log(props);
});

const styles = computed(() => {
  return {
    "--size": `${props.size - 2}px`,
    "--color": `rgb(${props.color.r},${props.color.g},${props.color.b})`,
  };
});


</script>

<style lang="scss" scoped>
.hexagon-item {
  width: var(--size);
  height: var(--size);
  background-color: var(--color);
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  text-align: center;
  line-height: var(--size);
  color: white;
  // clip-path: polygon();
  // border: 1px solid red;
  opacity: 0.6;

  &:hover {
    background-color: coral;
    z-index: 10;
    opacity: 1;
  }
}
</style>
