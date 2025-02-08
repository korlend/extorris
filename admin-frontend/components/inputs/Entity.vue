<template>
  <span class="entity__selection__input" @click.stop="">
    <v-autocomplete
      v-model="localModel"
      :label="label"
      :clearable="clearable"
      :items="builtItems"
      :custom-filter="filterFunction"
      :loading="isLoading"
      :disabled="disabled"
      @update:search="search"
      @update:model-value="updateValue">
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :title="getItemLabel(item.raw)" :append-avatar="getImageSrc(item.raw)">
        </v-list-item>
      </template>
      <template v-slot:selection="{ item }">
        <span class="entity__selection__input-label">
          <span>
            {{ getItemLabel(item.raw) }}
          </span>
          <img v-if="getImageSrc(item.raw)" class="entity__selection__input-label-image" :src="getImageSrc(item.raw)"> </img>
        </span>
      </template>
    </v-autocomplete>
  </span>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";
import MittEvents from "~/core/enums/MittEvents";
import DBFilter from "~/core/models/db/DBFilter";
import { FieldTypes, ModelPropertyMetadata } from "extorris-common";

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
  filters: {
    type: Object as PropType<{ [key: string]: any }>,
    default: {},
  },
  paginationSize: {
    type: Number,
    default: 10,
  },
  label: {
    type: String,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isLoading: Ref<boolean> = ref(true);

const items: Ref<Array<any>> = ref([]);
const tempSearchItems: Ref<Array<any>> = ref([]);

const localModel: Ref<Record<string, any> | undefined> = ref();
const loadedSelectedItem: Ref<Record<string, any> | null> = ref(null);

const total: Ref<number> = ref(0);

const loadedEntityKeys: Ref<Array<string>> = ref([]);
const loadedEntityKeysMetadata: Ref<{ [key: string]: ModelPropertyMetadata }> =
  ref({});

watch(model, async (newValue) => {
  await reloadItems(null);
  await trySetLocalModel(newValue);
});

watch(
  () => props.filters,
  async () => {
    await reloadItems(null);
  }
);

onMounted(async () => {
  await reloadEntityKeysMedadata();
  await reloadItems(null);
  if (model.value) {
    await trySetLocalModel(model.value);
  }
  $mittOn(MittEvents.RELOAD_ENTITY_AUTOCOMPLETE, () => {
    reloadItems(null);
  });
});

const builtItems = computed((): Array<Record<string, any>> => {
  if (tempSearchItems.value?.length) {
    return tempSearchItems.value;
  }
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

const getImageSrc = (item: Record<string, any>) => {
  if (!(props.entity === "image")) {
    return;
  }
  let imagePathKey = '';
  for(let i = 0; i < loadedEntityKeys.value.length; i++) {
    const key = loadedEntityKeys.value[i];
    const metadata = loadedEntityKeysMetadata.value[key];
    if (metadata.fieldType === FieldTypes.IMAGE_PATH) {
      imagePathKey = item[key];
    }
  }
  if (!imagePathKey) {
    return;
  }
  return `${getImagesUrl()}/${imagePathKey}`
}

const search = async (value: string) => {
  if (!value) {
    tempSearchItems.value = [];
    await reloadItems(null);
    return;
  }
  const response = await loadItems(value);
  tempSearchItems.value = response.items;
};

const updateValue = async (value: any) => {
  if (!value) {
    model.value = null;
    return;
  }
  if (value[props.modelEntityKey] === model.value) {
    return;
  }
  model.value = value[props.modelEntityKey];
  tempSearchItems.value = [];
};

const trySetLocalModel = async (value?: ModelType) => {
  await reloadItems(null)
  if (value !== null && value !== undefined) {
    let item = builtItems.value.find((v) => v[props.modelEntityKey] == value);
    if (!item && loadedSelectedItem.value && isLoadedSelectedItemOfCurrentModel.value) {
      item = loadedSelectedItem.value
    }
    localModel.value = item;
    return;
  }
  localModel.value = undefined;
};

const filterFunction = () => {
  // every value applicable, because we filter by request
  return true;
};

const reloadEntityKeysMedadata = async () => {
  const response = await entitiesStore.loadEntityKeys(props.entity);
  loadedEntityKeys.value = response.keys;
  loadedEntityKeysMetadata.value = response.keysMetadata;
};

const reloadItems = async (text: ModelType) => {
  isLoading.value = true;
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
  isLoading.value = false;
};

const loadItems = async (
  text: ModelType,
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
    props.paginationSize,
    dbFilters,
    sortBy,
    sortDirection
  );

  return response;
};
</script>

<style lang="scss" scoped>
.entity__selection__input {
  width: 100%;

  &-label {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;

    &-image {
      height: 100%;
    }
  }
}
</style>
