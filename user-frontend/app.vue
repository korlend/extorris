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
import { useConfigStore } from "./store/config";
import { useAuthStore } from "./store/auth";

const configStore = useConfigStore();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.addPostAuthCallback(() => {
    console.log("post auth callback", authStore.session)
    return configStore.loadConfigs();
  });
});
</script>

<style></style>
