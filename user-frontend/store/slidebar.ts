import { defineStore } from "pinia";
import type SlidebarTab from "~/core/models/slidebar_tabs/SlidebarTab";

export interface SlidebarState {
  active: boolean;
  currentTab?: SlidebarTab;
  previousTab?: SlidebarTab;
  tabs: Array<SlidebarTab>;
}

export const useSlidebarStore = defineStore("slidebar", {
  state: (): SlidebarState => {
    return {
      active: false,
      tabs: [],
      currentTab: undefined,
    };
  },
  getters: {
    isActive: (state: SlidebarState): boolean => {
      return state.active;
    },
    getTabs: (state: SlidebarState): Array<SlidebarTab> => {
      return state.tabs;
    },
    getCurrentTab: (state: SlidebarState): SlidebarTab | undefined => {
      return state.currentTab;
    },
  },
  actions: {
    toggleSlidebar(active?: boolean) {
      if (typeof active === "boolean") {
        this.active = active;
      } else {
        this.active = !this.active;
      }
    },
    createTab(tab: SlidebarTab, openSlidebar = true, setAsCurrent = true) {
      this.tabs.push(tab);
      if (setAsCurrent) {
        this.setCurrentTab(tab);
      }
      if (openSlidebar) {
        setTimeout(()=> this.toggleSlidebar(true))
      }
    },
    setCurrentTab(tab: SlidebarTab) {
      this.previousTab = this.currentTab;
      this.currentTab = tab;
    },
    deleteTab(tab: SlidebarTab) {
      const index = this.tabs.findIndex((v) => v.uuid === tab.uuid);
      if (index === -1) {
        return;
      }
      this.tabs.splice(index, 1);
      if (!this.tabs.length) {
        this.toggleSlidebar(false);
      } else if (this.tabs.findIndex((v) => v === this.previousTab) !== -1) {
        this.currentTab = this.previousTab;
      } else {
        this.currentTab = this.tabs[0];
      }
    }
  },
});
