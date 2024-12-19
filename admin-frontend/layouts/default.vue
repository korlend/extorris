<template>
  <v-app class="default__layout">
    <client-only>
      <slidebar-block />
      <ModalWindow />
      <div>
        <header-block />
      </div>
      <div class="default__layout-page__container">
        <sidebar-block />
        <!-- <footer-block /> -->
        <!-- .... -->
        <div
          class="default__layout-page__container-slot custom-scroll"
          :class="{ 'disabled-scroll': isOnMapPage }">
          <slot />
        </div>
      </div>
    </client-only>
  </v-app>
</template>

<script setup lang="ts">
import SidebarBlock from "@/components/blocks/SidebarBlock.vue";
import SlidebarBlock from "@/components/blocks/SlidebarBlock.vue";
// import FooterBlock from "@/components/blocks/FooterBlock.vue";
import HeaderBlock from "@/components/blocks/HeaderBlock.vue";

import { useRoute } from "vue-router";
import ModalWindow from "~/components/ModalWindow.vue";

const route = useRoute();

const isOnMapPage = computed(() => {
  return route.path.startsWith("/main_map");
});
</script>

<style lang="scss" scoped>
.default__layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  &-page__container {
    height: calc(100vh - 50px);
    display: flex;

    &-slot {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      &.disabled-scroll {
        overflow-y: hidden;
      }
    }
  }
}
</style>
