<template>
  <div class="image__container" :style="styles">
    <slot></slot>
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

</script>

<style lang="scss" scoped>
.image__container {
  background-image: var(--image);
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
</style>
