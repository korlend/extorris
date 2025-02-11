<template>
  <div class="modal__window" :class="{ active: isActive }" @click="closeModal">
    <div class="modal__window-inner" :class="innerClasses" @click.stop="">
      <div class="modal__window-inner-component">
        <component
          v-if="modalWindowData"
          :is="modalWindowData.component"
          v-bind="modalWindowData.props"
          :resolve="getResolve"
          :reject="getReject"
          @close="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModalWindowSize, useModalWindowStore } from "@/store/modal_window";

const modalWindowStore = useModalWindowStore();

onMounted(() => {});

onBeforeUnmount(() => {});

const innerClasses = computed(() => {
  const classes: Record<string, boolean> = {};

  let sizeClass = "large";
  switch (getSize.value) {
    case ModalWindowSize.LARGE:
      sizeClass = "large";
      break;
    case ModalWindowSize.MEDIUM:
      sizeClass = "medium";
      break;
    case ModalWindowSize.SMALL:
      sizeClass = "small";
      break;
  }

  classes[sizeClass] = true;

  return classes;
});

const isActive = computed(() => {
  return modalWindowStore.isActive;
});

const modalWindowData = computed(() => {
  return modalWindowStore.getData;
});

const getResolve = computed(() => {
  return modalWindowStore.getResolve;
});

const getReject = computed(() => {
  return modalWindowStore.getReject;
});

const getSize = computed(() => {
  return modalWindowData.value?.size || ModalWindowSize.LARGE;
});

const closeModal = () => {
  modalWindowStore.closeModal();
}
</script>

<style lang="scss" scoped>
@use "sass:map" as map;
@use "~/assets/styles/variables" as vars;

.modal__window {
  position: fixed;
  transform: translate(0, -200dvh);
  height: 100dvh;
  width: 100dvw;
  transition: all 0.1s ease;
  z-index: map.get(vars.$z-indices, "modal_window");
  justify-content: center;
  align-items: center;
  display: flex;

  &.active {
    transform: translate(0, 0);
  }

  &-inner {
    position: absolute;
    border-radius: 50px;
    // background-image: linear-gradient(to right, rgba(0, 105, 52, 0.9), rgba(63, 143, 255, 0.9));
    backdrop-filter: blur(20px);

    &.large {
      height: 800px;
      width: 1700px;
    }

    &.medium {
      height: 600px;
      width: 1000px;
    }

    &.small {
      height: 300px;
      width: 500px;
    }

    &-component {
      padding: 20px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
