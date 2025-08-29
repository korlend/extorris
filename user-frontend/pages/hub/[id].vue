<template>
  <div class="hub__page">
    <game-hub :hub-id="hubId" @update:hub-id="hubChanged"></game-hub>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute("hub-id");

const hubId = computed(() => {
  return parseInt(route.params.id);
});

const hubChanged = (hubId: number) => {
  router.replace({
    name: "hub-id",
    params: {
      id: hubId,
    },
  });
};
</script>

<style lang="scss" scoped>
.hub__page {
  width: 100%;
  height: 100%;
}
</style>
