<template>
  <v-container class="create-entity">
    <div class="create-entity-top__bar">
      <h4 class="create-entity-top__bar-text">Creating {{  }}</h4>
      <span class="create-entity-actions">
        <v-btn class="create-entity-actions-apply" :disabled="autoApply" @click="apply"> Apply </v-btn>
        <v-btn class="create-entity-actions-reset" @click="reset"> Reset </v-btn>
        <v-switch
          class="create-entity-actions-auto__apply"
          v-model="autoApply"
          label="Auto-apply">
        </v-switch>
      </span>
    </div>
    <v-row>
      <template v-for="data in keysWithMetadata" :key="data.key">
        <v-col
          v-if="
            data.metadata.fieldType === FieldTypes.PRIMARY_KEY ||
            data.metadata.fieldType === FieldTypes.INT
          "
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
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-number>
        </v-col>
        <v-col
          v-if="
            data.metadata.fieldType === FieldTypes.STRING ||
            data.metadata.fieldType === FieldTypes.STRING_SELECT
          "
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
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-string>
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
            :entity="getFieldEntity(data.key)"
            :label="data.key"
            @update:model-value="
              (v) => filterUpdated(data.key, v)
            "></inputs-entity>
        </v-col>
        <div>{{ localData[data.key] }}</div>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEntitiesStore } from "@/store/entities";
import { FieldTypes } from "extorris";
import type ModelPropertyMetadata from "~/core/models/ModelPropertyMetadata";

interface Metadata {
  [key: string]: ModelPropertyMetadata;
}

const entitiesStore = useEntitiesStore();

const emit = defineEmits(["update:create-entity"]);

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
});

const localData: Ref<{ [key: string]: any }> = ref({});

const autoApply: Ref<boolean> = ref(true);

onMounted(async () => {});

const keysWithMetadata = computed(() => {
  if (!props.keys.length || !props.metadata) {
    return [];
  }
  const arr: Array<{ key: string; metadata: ModelPropertyMetadata }> = [];
  for (let i = 0; i < props.keys.length; i++) {
    const key = props.keys[i];
    arr.push({
      key,
      metadata: props.metadata[key],
    });
  }
  return arr;
});

const filterUpdated = (key: string, value: any) => {
  if (autoApply.value === true) {
    emit("update:create-entity", deepToRaw(localData.value));
  }
};

const apply = () => {
  emit("update:create-entity", deepToRaw(localData.value));
};

const getFieldEntity = (key: string) => {
  const metadata = props.metadata[key];
  return metadata.fieldEntityType || "";
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
