<template>
  <div class="confirm__dialog">
    <h4 class="confirm__dialog-title">{{ title }}</h4>
    <div class="confirm__dialog-text">{{ text }}</div>
    <div class="confirm__dialog-buttons">
      <v-btn class="confirm__dialog-buttons-confirm" color="success" @click="confirm">Confirm</v-btn>
      <v-btn class="confirm__dialog-buttons-decline" color="error" @click="decline">Decline</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  resolve: {
    type: Function,
    required: true,
  },
  reject: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(["close-modal"])

const confirm = () => {
  props.resolve(true)
}

const decline = () => {
  props.reject(false)
}
</script>

<style lang="scss" scoped>
.confirm__dialog {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  &-title {
    padding: 10px;
  }

  &-text {
    padding: 10px;
  }

  &-buttons {
    padding: 10px;

    &-confirm {
      margin-right: 20px
    }

    &-decline {
    }
  }
}
</style>
