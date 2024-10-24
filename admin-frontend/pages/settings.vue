<template>
  <div class="settings">
    <v-select
      v-model="theme"
      :items="['dark', 'light']"
      @update:model-value="themeChange" />
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, type ThemeType } from "@/store/settings";

const theme: Ref<ThemeType> = ref("dark");

const settingsStore = useSettingsStore();

onMounted(() => {
  theme.value = settingsStore.getTheme;
});

const themeChange = () => {
  console.log("theme change");
  settingsStore.setTheme(theme.value);
};
</script>

<style lang="scss" scoped>
.settings {
  height: 100dvh;
  width: 100%;
}
</style>
