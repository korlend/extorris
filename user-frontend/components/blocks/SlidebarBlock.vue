<template>
  <div class="slidebar__block" :class="{ active: isActive }">
    <div class="slidebar__block-inner">
      <v-btn
        class="slidebar__block-inner-toggle__btn"
        :class="{ inactive: !isActive }"
        icon
        @click="toggleSlidebar">
        <v-icon class="slidebar__block-inner-toggle__btn-icon">{{
          isActive ? "mdi-arrow-collapse-right" : "mdi-arrow-collapse-left"
        }}</v-icon>
      </v-btn>
      <div class="slidebar__block-inner-body">
        <v-tabs
          v-model="currentTab"
          bg-color="indigo"
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          show-arrows>
          <v-tab
            v-for="(tab, index) in tabs"
            :key="tab.uuid"
            :value="tab"
            @mouseDown.middle.prevent="deleteTab(tab)">
            {{ `${tab.tabName || index}` }}
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="currentTab">
          <v-tabs-window-item
            v-for="(tab, index) in tabs"
            :key="tab.uuid"
            :value="tab"
            class="slidebar__block-inner-body-component">
            <div>
              <v-btn icon @click="deleteTab(tab)">
                <v-icon class="slidebar__block-inner-toggle__btn-icon">
                  mdi-delete-circle
                </v-icon>
              </v-btn>
            </div>
            <div>
              <component
                :is="tab.component"
                v-bind="tab.props"
                @close="deleteAndClose(tab)" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlidebarStore } from "@/store/slidebar";
import type SlidebarTab from "~/core/models/slidebar_tabs/SlidebarTab";
import { storeToRefs } from "pinia";

const slidebarStore = useSlidebarStore();

const { currentTab } = storeToRefs(slidebarStore);

// watch()

onMounted(() => {
  window.addEventListener("keydown", keydown);
  // removeWatch = slidebarStore.$subscribe((mutation, state) => {
  //   console.log("STATE CHANGE", state.currentTab);
  //   console.log("STATE CHANGE", );
  // })
});

onBeforeUnmount(() => {
  // removeWatch();
  window.removeEventListener("keydown", keydown);
});

// const currentTab: Ref<SlidebarTab | undefined> = ref();

const isActive = computed(() => {
  return slidebarStore.isActive;
});

const tabs = computed(() => {
  return deepToRaw(slidebarStore.getTabs);
});

const keydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "q") {
    slidebarStore.toggleSlidebar();
  }
};

const toggleSlidebar = () => {
  slidebarStore.toggleSlidebar();
};

const deleteTab = (tab: SlidebarTab) => {
  slidebarStore.deleteTab(tab);
};

const closeSlidebar = () => {
  slidebarStore.toggleSlidebar(false);
};

const deleteAndClose = (tab: SlidebarTab) => {
  slidebarStore.toggleSlidebar(false);
  slidebarStore.deleteTab(tab);
};

// const changeTab = () => {
//   if (!currentTab.value) {
//     return;
//   }
//   slidebarStore.setCurrentTab(currentTab.value);
// };

// const changeTab = (tab: SlidebarTab) => {
//   slidebarStore.setCurrentTab(tab);
// };
</script>

<style lang="scss" scoped>
.slidebar__block {
  position: fixed;
  top: 50px;
  left: 100dvw;
  z-index: 110;
  width: calc(100dvw - 200px);
  height: calc(100dvh - 40px);
  backdrop-filter: blur(10px);
  transition: 0.3s all;

  &.active {
    left: 200px;
  }

  &-inner {
    position: relative;
    width: calc(100dvw - 200px);
    height: calc(100dvh - 40px);

    &-toggle__btn {
      position: absolute;
      left: 0px;
      top: 0px;
      border-radius: 0;
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: left;

      &-icon {
        width: 40px;
        height: 40px;
      }

      &.inactive {
        left: -40px;
      }
    }

    &-body {
      position: absolute;
      top: 40px;
      left: 0px;
      width: calc(100dvw - 200px);
      height: calc(100dvh - 40px);

      &-component {
        width: calc(100dvw - 200px);
        height: calc(100dvh - 40px);
      }
    }
  }
}
</style>
