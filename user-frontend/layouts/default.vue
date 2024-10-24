<template>
  <v-app>
    <div>
      <header-block />
    </div>
    <div>
      <sidebar-block />
      <!-- <footer-block /> -->
      <!-- .... -->
      <slot />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import SidebarBlock from "@/components/blocks/SidebarBlock.vue";
// import FooterBlock from "@/components/blocks/FooterBlock.vue";
import HeaderBlock from "@/components/blocks/HeaderBlock.vue";
</script>

<style>
</style>
