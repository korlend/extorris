<template>
  <span class="date-input">
    <inputs-string
      v-model="modelAsString"
      :label="label"
      clearable
      :disabled="disabled"
      @keyup.enter.stop="updateInput"
      @click:clear="clearDatePicker"
      @click.stop="() => toggleDatePicker()" />
    <div
      class="date-input-datepicker"
      :class="{ shown: showDatePicker }"
      v-on-click-outside="() => toggleDatePicker(false)">
      <v-date-picker
        v-model="localModel"
        :disabled="disabled"
        show-adjacent-months
        @update:model-value="updateValue"></v-date-picker>
    </div>
  </span>
</template>

<script setup lang="ts">
import MittEvents from '~/core/enums/MittEvents';

const model = defineModel<Date | null>({ type: Date, default: new Date() });
const emit = defineEmits(["update:model-value"]);

const id = Symbol();

const { $mittEmit, $mittOn } = useNuxtApp();

const props = defineProps({
  label: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const localModel: Ref<Date | null> = ref(model.value);

const modelAsString: Ref<string> = ref("");

const showDatePicker = ref(false);

watch(
  () => model.value,
  (newValue) => {
    localModel.value = newValue;
    if (newValue) {
      modelAsString.value = newValue.toLocaleDateString();
    } else {
      modelAsString.value = "";
    }
  }
);

$mittOn(MittEvents.DATEPICKER, (eventId) => {
  if (eventId !== id) {
    showDatePicker.value = false;
  }
})

onMounted(async () => {});

const updateInput = () => {
  try {
    const value = modelAsString.value;
    const date = new Date(value);
    if (date instanceof Date && !isNaN(date.getTime())) {
      model.value = date;
      modelAsString.value = date.toLocaleDateString();
      emit("update:model-value", date);
    }
  } catch (ex) {}
};

const updateValue = (value: Date | null) => {
  if (value === model.value) {
    return;
  }
  model.value = value;
  modelAsString.value = value ? value.toLocaleDateString() : "";
  emit("update:model-value", value);
};

const toggleDatePicker = (value?: boolean) => {
  if (props.disabled) {
    showDatePicker.value = false;
    return;
  }
  $mittEmit(MittEvents.DATEPICKER, id);
  if (typeof value === "boolean") {
    showDatePicker.value = value;
    return;
  }
  // be careful with infinite recursion
  // window.dispatchEvent(new Event("click"));
  showDatePicker.value = !showDatePicker.value;
};

const clearDatePicker = () => {
  model.value = null;
  modelAsString.value = "";
  emit("update:model-value", null);
};
</script>

<style lang="scss" scoped>
.date-input {
  width: 100%;

  &-datepicker {
    position: absolute;
    display: none;
    z-index: 100;

    &.shown {
      display: block;
    }
  }
}
</style>
