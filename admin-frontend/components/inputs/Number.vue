<template>
  <span class="number__input">
    <v-text-field
      v-model="localModel"
      type="number"
      :label="label"
      :clearable="clearable"
      :disabled="disabled"
      @update:model-value="updateValue"
      ></v-text-field>
  </span>
</template>

<script setup lang="ts">
const model = defineModel<number | null>({ type: Number, default: null });
// const emit = defineEmits(["update:model-value"]);

const props = defineProps({
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

const localModel = ref(model.value);

watch(model, (newValue) => {
  localModel.value = newValue;
});

const updateValue = (value: string) => {
  const parsedValue = value ? parseInt(value) : null;
  if (parsedValue === model.value) {
    return;
  }
  model.value = parsedValue;
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.number__input {
  width: 100%;
}
</style>
