<template>
  <v-app class="default__layout">
    <client-only>
      <!-- <slidebar-block /> -->
      <ModalWindow />
      <header-block />
      <div class="default__layout-page__container">
        <!-- <sidebar-block /> -->
        <!-- <footer-block /> -->
        <!-- .... -->
        <div class="default__layout-page__container-slot custom-scroll">
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
