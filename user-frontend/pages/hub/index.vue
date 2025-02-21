<template>
  <div></div>
</template>

<script setup lang="ts">
const router = useRouter();
onBeforeMount(() => {
  router.push({
    name: "hub-id",
    params: {
      id: 0,
    },
  });
});
</script>

<style lang="scss" scoped></style>
