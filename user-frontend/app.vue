<template>
  <v-app class="custom__scroll">
    <LocalAlert />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import LocalAlert from "@/components/LocalAlerts.vue";
</script>

<style></style>
