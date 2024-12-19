<template>
  <div class="entity">
    <blocks-entity-view-list
      :entity="entityName"
      :page="currentPage"
      :page-size="pageSize"></blocks-entity-view-list>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

onMounted(async () => {});

const entityName = computed(() => {
  return route.params.entity as string;
})

const currentPage = computed(() => {
  return parseInt(route.query.page as string) || 1;
})

const pageSize = computed(() => {
  return parseInt(route.query.pageSize as string) || 20;
})
</script>

<style lang="scss" scoped>
.entity {
  height: 100%;
  width: 100%;
}
</style>
