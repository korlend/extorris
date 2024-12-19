<template>
  <div class="shipyard__menu">
    <div class="shipyard__menu-left">
      <div class="shipyard__menu-left-image">
        <span>{{ getUserShip?.name }}</span>
      </div>
      <div class="shipyard__menu-left-stats">123</div>
    </div>
    <div class="shipyard__menu-right">
      <div class="shipyard__menu-right-loadout">
        <div v-for="shipPart in getEquippedShipParts">{{ shipPart }}</div>
      </div>
      <div class="shipyard__menu-right-inventory">
        <div class="shipyard__menu-right-inventory-cell" v-for="shipPart in getUserShipParts">{{ shipPart }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShipStore } from "~/store/ship";

const shipStore = useShipStore();

onMounted(async () => {
  const response = await shipStore.loadShipInfo();
  console.log(response);
});

const getUserShip = computed(() => {
  return shipStore.getUserShip;
});

const getUserShipParts = computed(() => {
  return shipStore.getUserShipParts;
});

const getEquippedShipParts = computed(() => {
  return shipStore.getEquippedShip;
});

const getExistingShipParts = computed(() => {
  return shipStore.getExistingShipParts;
});
</script>

<style lang="scss" scoped>
.shipyard__menu {
  width: 100%;
  height: 100%;
  display: flex;

  &-left {
    width: 30%;
    height: 100%;

    &-image {
      height: 50%;
      border-right: 1px solid grey;
      // border-right: 1px solid grey;
      border-bottom: 1px solid grey;
      background-image: url("boat.png");
      background-size: cover;
    }
  }

  &-right {
    width: 70%;
    height: 100%;

    &-loadout {
      height: 20%;
    }

    &-inventory {
      display: flex;
      &-cell {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
