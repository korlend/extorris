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
        <div class="shipyard__menu-right-loadout-row">
          <span
            class="shipyard__menu-right-loadout-row-item"
            @click="unequipItem(getEquippedArmor)">
            <CommonImageContainer
              class="shipyard__menu-right-loadout-row-item-image"
              :is-empty="!getEquippedArmor">
              <template v-if="getEquippedArmor">
                {{ `${getEquippedArmor.id} - ${getEquippedArmor.code_name}` }}
              </template>
            </CommonImageContainer>
          </span>
          <span
            class="shipyard__menu-right-loadout-row-item"
            @click="unequipItem(getEquippedEnergyCore)">
            <CommonImageContainer
              class="shipyard__menu-right-loadout-row-item-image"
              :is-empty="!getEquippedEnergyCore">
              <template v-if="getEquippedEnergyCore">
                {{
                  `${getEquippedEnergyCore.id} - ${getEquippedEnergyCore.code_name}`
                }}
              </template>
            </CommonImageContainer>
          </span>
          <span
            class="shipyard__menu-right-loadout-row-item"
            @click="unequipItem(getEquippedEngine)">
            <CommonImageContainer
              class="shipyard__menu-right-loadout-row-item-image"
              :is-empty="!getEquippedEngine">
              <template v-if="getEquippedEngine">
                {{ `${getEquippedEngine.id} - ${getEquippedEngine.code_name}` }}
              </template>
            </CommonImageContainer>
          </span>
          <span
            class="shipyard__menu-right-loadout-row-item"
            @click="unequipItem(getEquippedHull)">
            <CommonImageContainer
              class="shipyard__menu-right-loadout-row-item-image"
              :is-empty="!getEquippedHull">
              <template v-if="getEquippedHull">
                {{ `${getEquippedHull.id} - ${getEquippedHull.code_name}` }}
              </template>
            </CommonImageContainer>
          </span>
        </div>
        <div class="shipyard__menu-right-loadout-row" v-if="getEquippedHull">
          <span
            class="shipyard__menu-right-loadout-row-item"
            v-for="i in getEquippedHull.cannon_slots">
            <CommonImageContainer
              class="shipyard__menu-right-loadout-row-item-image"
              :is-empty="!getEquippedCannon(i - 1)">
              <template v-if="getEquippedCannon(i - 1)">
                {{
                  `${getEquippedCannon(i - 1).id} - ${
                    getEquippedCannon(i - 1).code_name
                  }`
                }}
              </template>
              <template v-else> cannon slot {{ i }} </template>
            </CommonImageContainer>
          </span>
        </div>
        <!-- <div v-for="shipItem in getEquippedShipItems">
          {{ shipItem }}
        </div> -->
      </div>
      <div class="shipyard__menu-right-inventory">
        <div
          class="shipyard__menu-right-inventory-cell"
          v-for="shipItem in getAllShipItems"
          @click="equipItem(shipItem)">
          <CommonImageContainer
            class="shipyard__menu-right-inventory-cell-image">
            {{ `${shipItem.id} - ${shipItem.code_name}` }}
          </CommonImageContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShipItemType from "~/core/enums/ShipItemType";
import { useShipStore } from "~/store/ship";

const shipStore = useShipStore();

onMounted(async () => {
  await reloadShipInfo();
});

const getUserShip = computed(() => {
  return shipStore.getUserShip;
});

const getEquippedArmor = computed(() => {
  return shipStore.getEquippedArmor;
});

const getEquippedCannons = computed(() => {
  return shipStore.getEquippedCannons;
});

const getEquippedEnergyCore = computed(() => {
  return shipStore.getEquippedEnergyCore;
});

const getEquippedEngine = computed(() => {
  return shipStore.getEquippedEngine;
});

const getEquippedHull = computed(() => {
  return shipStore.getEquippedHull;
});

const getAllShipItems = computed(() => {
  return [
    ...getShipArmors.value,
    ...getShipCannons.value,
    ...getShipEnergyCores.value,
    ...getShipEngines.value,
    ...getShipHulls.value,
  ];
});

const getShipArmors = computed(() => {
  return shipStore.getShipArmors;
});

const getShipCannons = computed(() => {
  return shipStore.getShipCannons;
});

const getShipEnergyCores = computed(() => {
  return shipStore.getShipEnergyCores;
});

const getShipEngines = computed(() => {
  return shipStore.getShipEngines;
});

const getShipHulls = computed(() => {
  return shipStore.getShipHulls;
});

const reloadShipInfo = async () => {
  const response = await shipStore.loadShipInfo();
  return response;
};

const equipItem = async (shipItem: any) => {
  await shipStore.equipShipItem(shipItem);
  await reloadShipInfo();
};

const unequipItem = async (shipItem: any) => {
  console.log(shipItem)
  await shipStore.unequipShipItem(shipItem);
  await reloadShipInfo();
};

const getEquippedCannon = (index: number) => {
  if (getEquippedCannons.value.length - 1 >= index) {
    return getEquippedCannons.value[index];
  }
  return null;
};
</script>

<style lang="scss" scoped>
.shipyard__menu {
  width: 100%;
  height: 100%;
  display: flex;

  &-left {
    width: 20%;
    max-width: 300px;
    height: 100%;
    flex-grow: 1;
    flex-basis: 0;

    &-image {
      height: 300px;
      border-right: 1px solid grey;
      // border-right: 1px solid grey;
      border-bottom: 1px solid grey;
      background-image: url("boat.png");
      background-size: cover;
    }
  }

  &-right {
    width: 80%;
    height: 100%;
    flex-grow: 1;
    flex-basis: 0;

    &-loadout {
      height: 300px;
      width: 100%;
      display: flex;
      flex-flow: column;

      &-row {
        padding: 10px 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        &-item {
          width: 100px;
          height: 100px;
          opacity: 0.8;
          transition: all linear 0.2s;
          overflow-wrap: break-word;
          cursor: pointer;

          &:hover {
            opacity: 1;
          }

          &-image {
            padding: 5px;
          }
        }
      }

      &-slot {
        height: 100%;
        // max-width: 50px;
        // width: 100%;
        flex-grow: 1;
        flex-basis: 0;
        border-right: 1px solid grey;
        border-bottom: 1px solid grey;
      }
    }

    &-inventory {
      display: flex;

      &-cell {
        $cell: &;
        width: 100px;
        height: 100px;
        overflow-wrap: break-word;
        margin: 5px;
        cursor: pointer;
        transition: all linear 0.2s;

        &:hover {
          margin: 3px;
        }

        &-image {
          padding: 5px;
          transition: all linear 0.2s;

          // #{$cell}:hover & {
          //   padding: 3px;
          // }
        }
      }
    }
  }
}
</style>
