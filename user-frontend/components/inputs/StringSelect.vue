<template>
  <span class="string-select">
    <v-autocomplete
      v-model="localModel"
      :label="label"
      :clearable="clearable"
      :items="items"
      :disabled="disabled"
      @update:model-value="updateValue">
      <!-- <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="getItemLabel(item)">
        </v-list-item>
      </template>
      <template v-slot:selection="{ item }">
        {{ getItemLabel(item) }}
      </template> -->
    </v-autocomplete>
  </span>
</template>

<script setup lang="ts">

const model = defineModel({ type: String });
const emit = defineEmits(["update:model-value"]);

const props = defineProps({
  items: {
    type: Array<string>,
    required: true,
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

const items: Array<string> = props.items;

const localModel = ref(model.value);

watch(model, (newValue) => {
  localModel.value = newValue;
});

onMounted(async () => {
});

const updateValue = (value: string) => {
  if (value === model.value) {
    return;
  }
  model.value = value;
  emit("update:model-value", value);
};
</script>

<style lang="scss" scoped>
.string-select {
  min-width: 250px;
}
</style>
