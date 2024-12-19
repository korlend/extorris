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
  return modalWindowData.value?.size ?? ModalWindowSize.LARGE;
});

const closeModal = () => {
  modalWindowStore.closeModal();
}
</script>

<style lang="scss" scoped>
.modal__window {
  position: fixed;
  // top: -100dvh;
  // left: -100dvw;
  transform: translate(0, -100dvh);
  height: 100dvh;
  width: 100dvw;
  transition: all 0.1s ease;
  // backdrop-filter: blur(5px);
  z-index: 300;

  &.active {
    // top: 0px;
    // left: 0px;
    transform: translate(0, 0);
  }

  &-inner {
    position: absolute;
    // backdrop-filter: blur(20px);
    // border-radius: 50px;
    // background-image: linear-gradient(to right, rgba(0, 105, 52, 0.9), rgba(63, 143, 255, 0.9));
    // background-color: #444;
    // z-index: 400;
    // background: rgb(150,150,150);
    backdrop-filter: blur(20px);

    &.large {
      top: 50px;
      left: 100px;
      height: calc(100dvh - 100px);
      width: calc(100dvw - 200px);
    }

    &.medium {
      top: 200px;
      left: 300px;
      height: calc(100dvh - 400px);
      width: calc(100dvw - 600px);
    }

    // &::before {
    //   position: absolute;
    //   content: '';
    //   backdrop-filter: blur(20px);
    //   border-radius: 50px;
    //   width: 100%;
    //   height: 100%;
    // }

    &-component {
      // padding: 20px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
