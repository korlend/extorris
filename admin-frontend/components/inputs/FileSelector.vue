<template>
  <span class="file__selector">
    <v-file-input
      v-model="localModel"
      :label="label"
      :clearable="clearable"
      :disabled="disabled"
      @update:model-value="updateValue"
      ></v-file-input>
    <img ref="imgRef" />
  </span>
</template>

<script setup lang="ts">
import { useEntitiesStore } from '~/store/entities';

const model = defineModel<File | undefined>({ type: File, default: null });
const emit = defineEmits(["update:model-value"]);

const entitiesStore = useEntitiesStore();

const imgRef = useTemplateRef("imgRef");

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

const localModel: Ref<File | undefined> = ref();

watch(model, async (newValue) => {
  if (!newValue) {
    localModel.value = undefined;
    return;
  }
  localModel.value = newValue;
});

const updateValue = (value?: File | Array<File>) => {
  if (value instanceof Array) {
    return;
  }
  model.value = value;
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.file__selector {
  width: 100%;
  display: flex;
}
</style>
