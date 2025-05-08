<template>
  <v-app class="default__layout">
    <client-only>
      <SectionsSlidebar />
      <ModalWindow />
      <div>
        <SectionsHeader />
      </div>
      <div class="default__layout-page__container">
        <SectionsSidebar />
        <!-- <SectionsFooter /> -->
        <!-- .... -->
        <div
          class="default__layout-page__container-slot custom__scroll"
          :class="{ 'disabled-scroll': isOnMapPage }">
          <slot />
        </div>
      </div>
    </client-only>
  </v-app>
</template>

<script setup lang="ts">

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
