<template>
  <v-app class="default__layout">
    <client-only>
      <SectionsChat />
      <ModalWindow />
      <SectionsHeader />
      <div class="default__layout-page__container">
        <div class="default__layout-page__container-slot custom-scroll">
          <slot />
        </div>
      </div>
    </client-only>
  </v-app>
</template>

<script setup lang="ts">

import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss" scoped>
.default__layout {
  max-height: 100vh;

  &-page__container {
    height: 100%;

    &-slot {
      height: 100%;
      width: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
    }
  }
}
</style>
