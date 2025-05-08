<template>
  <span class="string__input">
    <v-text-field
      v-model="localModel"
      type="string"
      :label="label"
      :clearable="clearable"
      :disabled="disabled"
      hide-details="auto"
      @click:clear="clearClick"
      @update:model-value="updateValue"></v-text-field>
  </span>
</template>

<script setup lang="ts">
const model = defineModel<string>({ type: String, default: "" });
const emit = defineEmits(["click:clear"]);

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

const localModel: Ref<string> = ref(model.value);

watch(model, (newValue) => {
  localModel.value = newValue;
});

const updateValue = (value: string) => {
  if (value === model.value) {
    return;
  }
  model.value = value;
};

const clearClick = () => {
  emit("click:clear");
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.string__input {
  width: 100%;
}
</style>
