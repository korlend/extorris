<template>
  <span class="number__input">
    <v-switch
      v-model="model"
      color="primary"
      :label="label"
      :disabled="disabled"
      @update:model-value="updateValue"
      ></v-switch>
  </span>
</template>

<script setup lang="ts">
const model = defineModel<boolean | null>({ type: Boolean, default: null });
// const emit = defineEmits(["update:model-value"]);

const props = defineProps({
  label: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const updateValue = (value: boolean | null) => {
  model.value = value;
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.number__input {
  width: 100%;
}
</style>
