<template>
  <v-app>
    <LocalAlert />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import LocalAlert from "@/components/LocalAlerts.vue";
import { useSettingsStore } from "@/store/settings";

const settingsStore = useSettingsStore();

onBeforeMount(() => {
  settingsStore.initSettings();
});
</script>

<style></style>
