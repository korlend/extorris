<template>
  <v-container class="filters">
    <div class="filters-top__bar">
      <h4 class="filters-top__bar-text">Filters</h4>
      <span class="filters-actions">
        <!-- <inputs-number
          class="filters-number"
          v-model="testNumber"
          :label="'first'" />
        <inputs-number
          class="filters-number"
          v-model="testNumber"
          :label="'second'" /> -->
        <v-btn
          class="filters-actions-apply"
          :disabled="autoApply"
          @click="apply">
          Apply
        </v-btn>
        <v-btn class="filters-actions-reset" @click="reset"> Reset </v-btn>
        <v-switch
          class="filters-actions-auto__apply"
          v-model="autoApply"
          label="Auto-apply">
        </v-switch>
      </span>
    </div>
    <v-row class="filters-row">
      <template v-for="data in keysWithMetadata" :key="data.key">
        <v-col
          v-if="
            data.metadata.fieldType === FieldTypes.PRIMARY_KEY ||
            data.metadata.fieldType === FieldTypes.INT
          "
          class="filters-row-col"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-number
            class="filters-row-number"
            :model-value="localFilters[data.key]"
            :label="data.key"
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-number>
        </v-col>
        <v-col
          v-if="
            data.metadata.fieldType === FieldTypes.STRING ||
            data.metadata.fieldType === FieldTypes.STRING_SELECT
          "
          class="filters-row-col"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-string
            class="filters-row-string"
            v-model="localFilters[data.key]"
            :label="data.key"
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-string>
        </v-col>
        <v-col
          v-if="
            data.metadata.fieldType === FieldTypes.IMAGE_PATH
          "
          class="filters-row-col"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-string
            class="filters-row-string"
            v-model="localFilters[data.key]"
            :label="data.key"
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-string>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.ENTITY_SELECT"
          class="filters-row-col"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-entity
            class="filters-row-entity"
            v-model="localFilters[data.key]"
            :entity="getFieldEntity(data.key)"
            :label="data.key"
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-entity>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.DATE && localFilters[data.key]"
          class="filters-row-col"
          xxl="4"
          xl="4"
          lg="4"
          md="6"
          sm="12"
          xs="12"
          cols="12">
          <div class="filters-row-col-dates">
            <inputs-date-picker
              class="filters-row-col-dates-first"
              v-model="localFilters[data.key]['from']"
              :label="`${data.key} from`"
              @update:model-value="
                (v: any) => filterUpdated(data.key, v, 'from')
              "></inputs-date-picker>
            <inputs-date-picker
              v-model="localFilters[data.key]['to']"
              :label="`${data.key} to`"
              @update:model-value="
                (v) => filterUpdated(data.key, v, 'to')
              "></inputs-date-picker>
          </div>
        </v-col>
        <div>{{ localFilters[data.key] }}</div>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";
import { FieldTypes, ModelPropertyMetadata } from "extorris-common";

type ExtraKey = "from" | "to";

interface Metadata {
  [key: string]: ModelPropertyMetadata;
}

const entitiesStore = useEntitiesStore();

const emit = defineEmits(["update:filters"]);

const props = defineProps({
  keys: {
    type: Array<string>,
    required: true,
    default: [],
  },
  metadata: {
    type: Object as PropType<Metadata>,
    required: true,
    default: {},
  },
  filters: {
    type: Object as PropType<{ [key: string]: any }>,
    default: {},
  },
});

const getInitLocalFilters = () => {
  const filters: { [key: string]: any } = {};
  for (let i = 0; i < props.keys.length; i++) {
    const key = props.keys[i];
    const metadata = props.metadata[key];
    if (metadata.fieldType === FieldTypes.DATE) {
      filters[key] = {
        from: undefined,
        to: undefined,
      };
    }
  }
  return filters;
};

const localFilters: Ref<{
  [key: string]: any;
}> = ref(
  (() => {
    return getInitLocalFilters();
  })()
);

const autoApply: Ref<boolean> = ref(true);

watch(
  () => props.filters,
  (newFilters) => {
    for (let i = 0; i < props.keys.length; i++) {
      const key = props.keys[i];
      const metadata = props.metadata[key];
      let value = newFilters[key];
      if (!value) {
        continue;
      }
      if (metadata.fieldType === FieldTypes.DATE && !(typeof localFilters.value[key] === "object")) {
        value = {
          from: value?.from,
          to: value?.to,
        };
      }
      localFilters.value[key] = value;
    }
  }
);

watch(
  () => props.keys,
  () => {
    localFilters.value = getInitLocalFilters();
  }
);

// onBeforeMount(async () => {
//   localFilters.value = getInitLocalFilters();
// });

const keysWithMetadata = computed(() => {
  if (!props.keys.length || !props.metadata) {
    return [];
  }
  const arr: Array<{ key: string; metadata: ModelPropertyMetadata }> = [];
  for (let i = 0; i < props.keys.length; i++) {
    const key = props.keys[i];
    const metadata = props.metadata[key];
    arr.push({
      key,
      metadata,
    });
  }
  return arr;
});

const filterUpdated = (key: string, value: any, extraKey?: ExtraKey) => {
  if (extraKey) {
    if (!localFilters.value[key]) {
      localFilters.value[key] = {};
    }
    localFilters.value[key][extraKey] = value;
  } else {
    localFilters.value[key] = value;
  }
  if (autoApply.value === true) {
    emit("update:filters", deepToRaw(localFilters.value));
  }
};

const apply = () => {
  emit("update:filters", deepToRaw(localFilters.value));
};

const getFieldEntity = (key: string) => {
  const metadata = props.metadata[key];
  return metadata.fieldEntityType || "";
};

const reset = () => {
  localFilters.value = {};
  apply();
};
</script>

<style lang="scss" scoped>
.filters {
  border: 1px solid grey;
  padding: 10px 20px;
  // margin: 5px;

  &-top__bar {
    height: 50px;
    display: flex;
    justify-content: space-between;

    &-text {
      // text-align: center;
      // line-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &-actions {
    display: flex;
    justify-content: right;
    align-items: center;
    // margin: 50px 0;

    &-apply {
      margin: 5px;
    }

    &-reset {
      margin: 5px;
    }

    &-auto__apply {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px;
    }
  }

  &-row {
    margin: 0;

    &-col {
      &-dates {
        display: flex;
      }
    }
  }
}
</style>
