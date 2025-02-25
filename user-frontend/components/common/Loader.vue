<template>
  <div class="loader">
    <span class="loader-progress" v-if="active">
      <v-progress-circular indeterminate> </v-progress-circular>
    </span>
    <span class="loader-slot">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.loader {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  &-progress {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
  }

  &-slot {
    width: 100%;
  }
}
</style>
