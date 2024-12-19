<template>
  <v-container class="filters">
    <div class="filters-top__bar">
      <h4 class="filters-top__bar-text">Actions</h4>
      <span class="filters-actions">
        <v-btn
          class="filters-actions-create"
          @click="create">
          Create
        </v-btn>
      </span>
    </div>
  </v-container>
</template>

<script setup lang="ts">

const emit = defineEmits(["action:create"]);

// const props = defineProps({
//   entity: {
//     type: String,
//     required: true,
//   },
// });

onMounted(async () => {});

const create = () => {
  emit("action:create");
};
</script>

<style lang="scss" scoped>
.filters {
  border: 1px solid grey;
  padding: 10px 20px;

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

    &-create {
      margin: 5px;
    }
  }
}
</style>
