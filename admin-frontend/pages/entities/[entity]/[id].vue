<template>
  <div class="entity">
    {{ route.params.entity }}
    {{ route.params.id }}
  </div>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";

const route = useRoute();

// const entitiesStore = useEntitiesStore();

const entityName: Ref<string> = ref(route.params.entity as string);
const entityId: Ref<number> = ref(parseInt(route.params.entity as string));

watch(route, (newRoute) => {
  entityName.value = newRoute.params.entity as string;
});
// const loadedEntityKeys: Ref<Array<string>> = ref([]);
// const loadedEntities: Ref<Array<any>> = ref([]);

// const total: Ref<number> = ref(0);
// const totalPages: Ref<number> = ref(0);

// const currentPage = ref(parseInt(route.query.page as string) || 1);
// const pageSize = ref(parseInt(route.query.pageSize as string) || 20);

// onMounted(async () => {
//   loadedEntityKeys.value = await entitiesStore.loadEntityKeys(entityName.value);
//   await reload();
// });

// const reload = async () => {
//   console.log("reload");
//   const response = await entitiesStore.filterEntity(
//     entityName.value,
//     (currentPage.value - 1) * pageSize.value,
//     pageSize.value
//   );
//   loadedEntities.value = response.items;
//   total.value = response.total;
//   totalPages.value = Math.ceil(response.total / pageSize.value);
// };
//
</script>

<style lang="scss" scoped>
.entity {
}
</style>
