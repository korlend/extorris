<template>
  <v-container class="create-entity">
    <div class="create-entity-top__bar">
      <h4 class="create-entity-top__bar-text">Creating {{ entity }}</h4>
      <span class="create-entity-actions">
        <v-btn class="create-entity-actions-apply" @click="createEntity">
          Create
        </v-btn>
        <v-btn class="create-entity-actions-reset" @click="reset">
          Reset
        </v-btn>
      </span>
    </div>
    <v-row>
      <template v-for="data in keysWithMetadata" :key="data.key">
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.PRIMARY_KEY"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-number
            class="create-entity-number"
            v-model="localData[data.key]"
            :label="data.key"
            :disabled="isFieldDisabled(data)"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-number>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.INT"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-number
            class="create-entity-number"
            v-model="localData[data.key]"
            :label="data.key"
            :disabled="isFieldDisabled(data)"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-number>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.STRING"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-string
            class="create-entity-string"
            v-model="localData[data.key]"
            :label="data.key"
            :disabled="isFieldDisabled(data)"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-string>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.STRING_SELECT"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-string-select
            class="create-entity-string__select"
            v-model="localData[data.key]"
            :disabled="isFieldDisabled(data)"
            :label="data.key"
            :items="data.metadata.stringList || []"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-string-select>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.ENTITY_SELECT"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-entity
            class="create-entity-entity"
            v-model="localData[data.key]"
            :disabled="isFieldDisabled(data)"
            :entity="getFieldEntity(data.key)"
            :label="data.key"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-entity>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.IMAGE_PATH"
          xxl="4"
          xl="4"
          lg="4"
          md="6"
          sm="6"
          xs="6"
          cols="12">
          <inputs-file-selector
            class="create-entity-entity"
            v-model="localData[data.key]"
            :disabled="isFieldDisabled(data)"
            :label="data.key"
            @update:model-value="
              (v) => dataUpdated(data.key, v)
            "></inputs-file-selector>
        </v-col>
        <v-col
          v-if="data.metadata.fieldType === FieldTypes.DATE"
          xxl="2"
          xl="2"
          lg="2"
          md="4"
          sm="6"
          xs="6"
          cols="12">
          <inputs-date-picker
            v-model="localData[data.key]"
            :label="data.key"
            :disabled="isFieldDisabled(data)"
            @update:model-value="
              (v: any) => dataUpdated(data.key, v)
            "></inputs-date-picker>
        </v-col>
        <div>{{ localData[data.key] }}</div>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";
import FieldTypes from "~/core/enums/FieldTypes";
import MittEvents from "~/core/enums/MittEvents";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";
import type ModelPropertyMetadata from "~/core/models/ModelPropertyMetadata";

interface Metadata {
  [key: string]: ModelPropertyMetadata;
}

interface KeyAndMetadata {
  key: string;
  metadata: ModelPropertyMetadata;
}

const { $mittEmit, $mittOn } = useNuxtApp();

const entitiesStore = useEntitiesStore();

const emit = defineEmits(["close"]);

const props = defineProps({
  entity: {
    type: String,
    required: true,
  },
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
  initialData: {
    type: Object as PropType<Record<string, any>>,
    default: {},
  },
});

const localData: Ref<{ [key: string]: any }> = ref(
  deepToRaw(props.initialData)
);

const autoApply: Ref<boolean> = ref(true);

onMounted(async () => {});

const keysWithMetadata = computed(() => {
  if (!props.keys.length || !props.metadata) {
    return [];
  }
  const arr: Array<KeyAndMetadata> = [];
  for (let i = 0; i < props.keys.length; i++) {
    const key = props.keys[i];
    arr.push({
      key,
      metadata: props.metadata[key],
    });
  }
  return arr;
});

const dataUpdated = (key: string, value: any) => {};

const createEntity = async () => {
  const response = await entitiesStore.createEntity(
    props.entity,
    localData.value,
    keysWithMetadata.value,
  );
  if (response.id) {
    $mittEmit(MittEvents.RELOAD_CURRENT_ENTITY_LIST);
    emit("close", response.id);
    createAlert(
      `Entity: ${props.entity}, id: ${response.id}`,
      LocalAlertTypes.SUCCESS,
      "Created"
    );
  }
};

const getFieldEntity = (key: string) => {
  const metadata = props.metadata[key];
  return metadata.fieldEntityType || "";
};

const isFieldDisabled = (data: KeyAndMetadata) => {
  return !!data.metadata.isImmutable;
};

const reset = () => {
  localData.value = {};
};
</script>

<style lang="scss" scoped>
.create-entity {
  border: 1px solid grey;
  margin: 5px;

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

  &-number {
  }
}
</style>
