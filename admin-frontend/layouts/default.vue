<template>
  <v-app class="default-layout">
    <div>
      <header-block />
    </div>
    <div>
      <sidebar-block />
      <!-- <footer-block /> -->
      <!-- .... -->
      <div class="default-layout__page-container">
        <slot />
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import SidebarBlock from "@/components/blocks/SidebarBlock.vue";
// import FooterBlock from "@/components/blocks/FooterBlock.vue";
import HeaderBlock from "@/components/blocks/HeaderBlock.vue";
</script>

<style lang="scss" scoped>
  .default-layout {
    // margin-left: 200px;

    &__page-container {
      margin-top: 50px;
      margin-left: 200px;
    }
  }
</style>
