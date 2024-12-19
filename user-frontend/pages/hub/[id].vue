<template>
  <div class="hub">
    <BlocksGameHub :hub-id="hubId"></BlocksGameHub>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();

onMounted(() => {});

const hubId = computed(() => {
  return parseInt(route.params.id as string);
})

</script>

<style lang="scss" scoped>
.hub {
}
</style>
