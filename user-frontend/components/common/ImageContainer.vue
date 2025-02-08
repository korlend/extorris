<template>
  <div class="image__container" :style="styles">
    <slot></slot>
    <span class="image__container-border" :style="borderStyles"></span>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  src: {
    type: String,
    required: false,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
  emptySrc: {
    type: String,
    required: false,
  },
})

onMounted(async () => {
});

const styles = computed(() => {
  return {
    "--image": `url("${getSrc.value}")`,
  }
})

const borderStyles = computed(() => {
  return {
    "--border-src": `url("${getBorderSrc.value}")`,
  }
})

const getSrc = computed(() => {
  const url = getImagesUrl();
  if (props.isEmpty) {
    if (props.emptySrc) {
      return `${url}/${props.emptySrc}`;
    }
    return 'empty.png'
  }
  if (props.src) {
    return `${url}/${props.src}`;
  }
  return `placeholder.png`
})

const getBorderSrc = computed(() => {
  return `item-border-1.png`;
})

</script>

<style lang="scss" scoped>
.image__container {
  position: relative;
  background-image: var(--image);
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  &-border {
    top: 0;
    left: 0;
    margin: -5px;
    background-image: var(--border-src);
    background-size: 100%;
    position: absolute;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    overflow: visible;
  }
}
</style>
