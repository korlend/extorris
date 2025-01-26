<template>
  <span class="entity__selection__input" @click.stop="">
    <v-autocomplete
      v-model="localModel"
      :label="label"
      :clearable="clearable"
      :items="items"
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
import type ModelPropertyMetadata from "~/core/models/ModelPropertyMetadata";
import MittEvents from "~/core/enums/MittEvents";
import type DBFilter from "~/core/models/db/DBFilter";
import { FieldTypes } from "extorris";

const { $mittOn } = useNuxtApp();

const entitiesStore = useEntitiesStore();

const model = defineModel<number | null>({ type: Number });
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
  maxSize: {
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
  autoselectFirst: {
    type: Boolean,
    default: false,
  },
});

const isLoading: Ref<boolean> = ref(true);

const items: Ref<Array<any>> = ref([]);

const localModel: Record<string, any> = ref({});

const total: Ref<number> = ref(0);

const autoselected: Ref<boolean> = ref(false);

const loadedEntityKeys: Ref<Array<string>> = ref([]);
const loadedEntityKeysMetadata: Ref<{ [key: string]: ModelPropertyMetadata }> =
  ref({});

watch(model, async (newValue) => {
  await reload();
  trySetLocalModel(newValue);
});

watch(
  () => props.filters,
  () => {
    reload();
  }
);

onMounted(async () => {
  const response = await entitiesStore.loadEntityKeys(props.entity);
  loadedEntityKeys.value = response.keys;
  loadedEntityKeysMetadata.value = response.keysMetadata;
  await reload();
  if (model.value) {
    trySetLocalModel(model.value);
  }
  $mittOn(MittEvents.RELOAD_ENTITY_AUTOCOMPLETE, () => {
    reload();
  });
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
  await reload(value);
};

const updateValue = (value: any) => {
  if (!value) {
    model.value = null;
    return;
  }
  if (value[props.modelEntityKey] === model.value) {
    return;
  }
  model.value = value[props.modelEntityKey];
};

const trySetLocalModel = (id?: number | null) => {
  if (id !== null && id !== undefined) {
    const item = items.value.find((v) => v.id == id);
    localModel.value = item;
    autoselected.value = false;
    return;
  }
  autoselected.value = true;
  localModel.value = undefined;
};

const filterFunction = () => {
  // every value applicable, because we filter by request
  return true;
};

const reload = async (text?: string | number) => {
  isLoading.value = true;
  let dbFilters: Array<DBFilter> = [];

  const filters = deepToRaw(props.filters);

  if (model.value && !filters.id) {
    filters.id = model.value;
  }

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
    text,
    0,
    props.maxSize,
    dbFilters,
    sortBy,
    sortDirection
  );
  items.value = response.items;
  total.value = response.total;
  trySetLocalModel(localModel.value?.id || model.value);

  if (!autoselected.value && props.autoselectFirst && !localModel.value && items.value.length) {
    updateValue(items.value[0])
    autoselected.value = true;
  }

  isLoading.value = false;
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
