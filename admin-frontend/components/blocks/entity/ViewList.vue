<template>
  <div class="view__list">
    <blocks-entity-filters
      v-model:filters="filters"
      :keys="loadedEntityKeys"
      :metadata="loadedEntityKeysMetadata"
      @update:filters="filtersUpdate" />
    <div v-for="(filter, key) in filters" :key="key">
      {{ key }}
      {{ filter }}
    </div>
    <blocks-entity-actions @action:create="createAction" />
    <v-table
      class="view__list-table"
      density="compact"
      :loading="isLoading"
      hover>
      <thead>
        <tr>
          <th v-for="entityKey in loadedEntityKeys" class="text-left">
            {{ entityKey }}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in loadedEntities"
          :key="item.id"
          class="pointer"
          @click="() => updateAction(item)">
          <td v-for="entityKey in loadedEntityKeys" class="view__list-table-body-row-cell">
            <template v-if="
                loadedEntityKeysMetadata[entityKey].fieldType === FieldTypes.IMAGE_PATH
              ">
              <span>
                {{ item[entityKey] }}
              </span>
              <img
                v-if="item[entityKey]"
                class="view__list-table-body-row-cell-image"
                :src="getImageSrc(item, entityKey)" />
            </template>
            <span
              v-else-if="
                loadedEntityKeysMetadata[entityKey].fieldEntityType === 'image'
              ">
              <img
                v-if="item[entityKey]"
                class="view__list-table-body-row-cell-image"
                :src="getImageSrc(item, entityKey)" />
            </span>
            <span
              v-else-if="
                loadedEntityKeysMetadata[entityKey].fieldEntityType &&
                loadedEntityKeysMetadata[entityKey].fieldType ===
                  FieldTypes.ENTITY_SELECT &&
                loadedLinkedEntities[item.id]
              ">
              {{
                getItemLabel(
                  loadedLinkedEntities[item.id][
                    loadedEntityKeysMetadata[entityKey].fieldEntityType
                  ]
                )
              }}
              <!-- {{ loadedEntityKeysMetadata[entityKey].fieldEntityType }} -->
            </span>
            <span v-else>
              {{ item[entityKey] }}
            </span>
          </td>
          <td>
            <v-btn icon @click.stop="() => deleteAction(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="view__list-pagination">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        :loading="isLoading"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        @update:model-value="reload()"></v-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import create from "./Create.vue";
import update from "./Update.vue";
import { useEntitiesStore } from "@/store/entities";
import type ModelPropertyMetadata from "~/core/models/ModelPropertyMetadata";
import { useSlidebarStore } from "@/store/slidebar";
import SlidebarTab from "~/core/models/slidebar_tabs/SlidebarTab";
import MittEvents from "~/core/enums/MittEvents";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import FieldTypes from "~/core/enums/FieldTypes";

// const eEntityFieldTypes = EntityFieldTypes;

const { $mittEmit, $mittOn } = useNuxtApp();

const route = useRoute();

const slidebarStore = useSlidebarStore();
const entitiesStore = useEntitiesStore();

const props = defineProps({
  entity: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
});

const isLoading: Ref<boolean> = ref(true);

const entityName: Ref<string> = ref(props.entity as string);
const loadedEntityKeys: Ref<Array<string>> = ref([]);
const loadedEntityKeysMetadata: Ref<{ [key: string]: ModelPropertyMetadata }> =
  ref({});
const loadedEntities: Ref<Array<any>> = ref([]);
const loadedLinkedEntities: Ref<Record<number, Record<string, any>>> = ref({});

const total: Ref<number> = ref(0);
const totalPages: Ref<number> = ref(0);

const currentPage = ref(props.page || 1);
const pageSize = ref(props.pageSize || 20);

const filters: Ref<{ [key: string]: any }> = ref({});

watch(route, () => {
  filters.value = {};
});

$mittOn(MittEvents.RELOAD_CURRENT_ENTITY_LIST, () => {
  reload(filters.value);
});

onMounted(async () => {
  const response = await entitiesStore.loadEntityKeys(entityName.value);
  loadedEntityKeys.value = response.keys;
  loadedEntityKeysMetadata.value = response.keysMetadata;
  await reload();
});

const preparedData = computed(() => {
  const preparedData: Array<any> = [];
  const unRefLoadedEntities = deepToRaw(loadedEntities.value);

  for (let i = 0; i < unRefLoadedEntities.length; i++) {
    const entityRow = unRefLoadedEntities[i];
    const preparedEntityRow: Record<string, any> = {};
    for (let j = 0; j < loadedEntityKeys.value.length; j++) {
      const entityKey = loadedEntityKeys.value[j];
      const metadata = loadedEntityKeysMetadata.value[entityKey];
      if (metadata.fieldEntityType === "image") {
        preparedEntityRow[entityKey] = entityRow[entityKey];
      }
      preparedEntityRow[entityKey] = entityRow[entityKey];
    }
  }

  return preparedData;
});

const getImageSrc = (item: Record<string, any>, key: string) => {
  const url = getImagesUrl();
  return `${url}/${item[key]}`;
};

const reload = async (filters: { [key: string]: any } = {}) => {
  isLoading.value = true;
  console.log(filters)
  const dbFilters = createDBFilters(filters, loadedEntityKeysMetadata.value);
  console.log(dbFilters)
  const response = await entitiesStore.filterEntity(
    entityName.value,
    (currentPage.value - 1) * pageSize.value,
    pageSize.value,
    dbFilters
  );
  loadedEntities.value = response.items;
  total.value = response.total;
  loadedLinkedEntities.value = response.loadedLinkedEntities ?? {};
  totalPages.value = Math.ceil(response.total / pageSize.value);
  isLoading.value = false;
};

const filtersUpdate = () => {
  reload(filters.value);
};

const createAction = () => {
  slidebarStore.createTab(
    new SlidebarTab(create, {
      entity: props.entity,
      keys: loadedEntityKeys.value,
      metadata: loadedEntityKeysMetadata.value,
    }),
    true
  );
};

const updateAction = (item: any) => {
  slidebarStore.createTab(
    new SlidebarTab(update, {
      entity: props.entity,
      id: item.id,
      keys: loadedEntityKeys.value,
      metadata: loadedEntityKeysMetadata.value,
    }),
    true
  );
};

const deleteAction = async (item: any) => {
  await entitiesStore.deleteEntity(props.entity, item.id);
  createAlert(
    `Entity: ${props.entity}, id: ${item.id}`,
    LocalAlertTypes.SUCCESS,
    "Deleted"
  );
  reload(filters.value);
};
</script>

<style lang="scss" scoped>
.view__list {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-table {
    &-body {
      &-row {
        &-cell {
          &-image {
            height: 30px;
          }
        }
      }
    }
  }

  &-pagination {
    position: sticky;
    display: flex;
    justify-content: center;
    bottom: 0;
    left: 0;
    backdrop-filter: blur(10px);
    height: 60px;
    width: 100%;
  }
}
</style>
