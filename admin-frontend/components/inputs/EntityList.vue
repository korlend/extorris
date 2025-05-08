<template>
  <div class="entity__list custom__scroll" @click.stop="">
    <div class="entity__list-search__box">
      <inputs-string
        v-model="searchString"
        :label="label || entity"
        @update:model-value="fullReload"></inputs-string>
    </div>
    <div
      class="entity__list-item"
      :class="{ selected: localModel === item[modelEntityKey] }"
      v-for="item in builtItems"
      @click="selectItem(item[modelEntityKey])">
      <span>
        {{ `${modelEntityKey}: ${getItemLabel(item)}` }}
      </span>
      <slot v-if="$slots.extra_data" name="extra_data" :item="item"></slot>
      <span>
        <v-icon
          class="entity__list-close__icon"
          v-if="localModel === item[modelEntityKey]"
          @click.stop="clearSelection"
          >mdi-close</v-icon
        >
      </span>
    </div>
    <v-btn class="entity__list-load__more" @click="loadMore">Load More</v-btn>
  </div>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";
import type { ModelPropertyMetadata } from "extorris-common";
import DBFilter from "~/core/models/db/DBFilter";

type ModelType = number | string | null;

const { $mittOn } = useNuxtApp();

const entitiesStore = useEntitiesStore();

const model = defineModel<ModelType>({ type: [Number, String] });
// const emit = defineEmits(["update:model-value"]);

const props = defineProps({
  entity: {
    type: String,
    required: true,
  },
  modelEntityKey: {
    type: String,
    default: "id",
  },
  label: {
    type: String,
    default: "",
  },
  filters: {
    type: Object as PropType<{ [key: string]: any }>,
    default: {},
  },
  paginationSize: {
    type: Number,
    default: 10,
  },
});

const loadedSelectedItem: Ref<Record<string, any> | null> = ref(null);
const items: Ref<Array<Record<string, any>>> = ref([]);
const total: Ref<number> = ref(0);
const pagesLoaded: Ref<number> = ref(0);

const searchString: Ref<string> = ref("");

const localModel: Ref<ModelType> = ref(null);

const loadedEntityKeys: Ref<Array<string>> = ref([]);
const loadedEntityKeysMetadata: Ref<{ [key: string]: ModelPropertyMetadata }> =
  ref({});

watch(model, async (newValue) => {
  // await reloadItems();
  console.log("SET NEW VALUE", props.entity, newValue);
  localModel.value = newValue || null;
});

watch(
  () => props.filters,
  async () => {
    pagesLoaded.value = 1;
    model.value = null;
    console.log("FILTERS CHANGED", props.entity, props.filters);
    await reloadItems(null);
  }
);

onMounted(async () => {
  await reloadEntityKeysMedadata();
  localModel.value = model.value || null;
  pagesLoaded.value = 1;
  await reloadItems(null);
});

const builtItems = computed((): Array<Record<string, any>> => {
  const internalItems = [];
  if (
    model.value &&
    loadedSelectedItem.value &&
    !selectedItemExistsInItems.value &&
    isLoadedSelectedItemOfCurrentModel.value
  ) {
    internalItems.push(loadedSelectedItem.value);
  }
  return [...internalItems, ...items.value];
});

const isLoadedSelectedItemOfCurrentModel = computed(() => {
  return loadedSelectedItem.value?.[props.modelEntityKey] == model.value;
});

const selectedItemExistsInItems = computed(() => {
  return items.value.some((item) => item[props.modelEntityKey] == model.value);
});

const selectItem = async (value: ModelType) => {
  model.value = value;
};

const loadMore = () => {
  pagesLoaded.value++;
  reloadItems(searchString.value);
};

const fullReload = async (value?: string) => {
  pagesLoaded.value = 1;
  await reloadItems(value);
};

const clearSelection = async () => {
  model.value = null;
  await reloadItems(null);
};

const reloadEntityKeysMedadata = async () => {
  const response = await entitiesStore.loadEntityKeys(props.entity);
  loadedEntityKeys.value = response.keys;
  loadedEntityKeysMetadata.value = response.keysMetadata;
};

const reloadItems = async (text?: ModelType) => {
  const response = await loadItems(text, props.filters);
  items.value = response.items;
  total.value = response.total;
  if (
    model.value &&
    !selectedItemExistsInItems.value &&
    !isLoadedSelectedItemOfCurrentModel.value
  ) {
    const response = await loadItems(null, {
      [props.modelEntityKey]: model.value,
    });
    if (response.items.length) {
      loadedSelectedItem.value = response.items[0];
    }
  }
};

const loadItems = async (
  text?: ModelType,
  filters: { [key: string]: any } = {}
) => {
  let dbFilters: Array<DBFilter> = [];

  if (props.filters) {
    dbFilters = createDBFilters(filters, loadedEntityKeysMetadata.value);
  }

  let sortBy = "id";
  const sortDirection = "desc";
  if (loadedEntityKeys.value.includes("updated")) {
    sortBy = "updated";
  }

  const response = await entitiesStore.fastFilterEntity(
    props.entity,
    text === null ? undefined : text,
    0,
    props.paginationSize * pagesLoaded.value,
    dbFilters,
    sortBy,
    sortDirection
  );

  return response;
};
</script>

<style lang="scss" scoped>
.entity__list {
  width: 100%;
  padding: 5px;
  border: 1px solid rgb(100, 100, 100);
  max-height: 200px;
  overflow-y: scroll;

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    padding: 0 10px;
    border-bottom: 1px solid rgb(130, 130, 130);
    cursor: pointer;
    margin-bottom: 5px;

    &:hover {
      background-color: rgb(50, 50, 50);
    }

    &.selected {
      background-color: rgb(80, 80, 80);
    }
  }

  &-search__box {
    width: 100%;
  }

  &-load__more {
    width: 100%;
  }
}
</style>
