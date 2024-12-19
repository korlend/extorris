<template>
  <div class="main-map">
    <client-only>
      <MainMap :depth="15" :hexagon-size="80" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import MainMap from "~/components/blocks/game/MainMap.vue";

onMounted(() => {});
</script>

<style lang="scss" scoped>
</style>
