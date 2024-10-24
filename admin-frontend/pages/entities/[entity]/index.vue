<template>
  <div class="entity">
    <v-table density="compact">
      <thead>
        <tr>
          <th v-for="entityKey in loadedEntityKeys" class="text-left">
            {{ entityKey }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in loadedEntities" :key="item.id">
          <td v-for="entityKey in loadedEntityKeys">
            {{ item[entityKey] }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      class="entity__pagination"
      :length="totalPages"
      :total-visible="5"
      next-icon="mdi-menu-right"
      prev-icon="mdi-menu-left"
      @update:model-value="reload"></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";

const route = useRoute();

const entitiesStore = useEntitiesStore();

const entityName: Ref<string> = ref(route.params.entity as string);
const loadedEntityKeys: Ref<Array<string>> = ref([]);
const loadedEntities: Ref<Array<any>> = ref([]);

const total: Ref<number> = ref(0);
const totalPages: Ref<number> = ref(0);

const currentPage = ref(parseInt(route.query.page as string) || 1);
const pageSize = ref(parseInt(route.query.pageSize as string) || 20);

onMounted(async () => {
  loadedEntityKeys.value = await entitiesStore.loadEntityKeys(entityName.value);
  await reload();
});

const reload = async () => {
  console.log("reload");
  const response = await entitiesStore.filterEntity(
    entityName.value,
    (currentPage.value - 1) * pageSize.value,
    pageSize.value
  );
  loadedEntities.value = response.items;
  total.value = response.total;
  totalPages.value = Math.ceil(response.total / pageSize.value);
};
</script>

<style lang="scss" scoped>

.entity {

  &__pagination {
    position: fixed;
    bottom: 0;
    backdrop-filter: blur(10px);
    width: calc(100% - 200px);
  }
}
</style>
