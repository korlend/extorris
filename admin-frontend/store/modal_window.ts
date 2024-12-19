import { defineStore } from "pinia";

export enum ModalWindowSize {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

export interface ModalWindowData {
  component?: Component;
  props?: Record<string, any>;
  title?: string;
  size?: ModalWindowSize;
}

interface ModalWindowState {
  active: boolean;
  data: ModalWindowData | undefined;
  resolve: Function | undefined;
  reject: Function | undefined;
}

export const useModalWindowStore = defineStore("modal_window", {
  state: (): ModalWindowState => {
    return {
      active: false,
      data: undefined,
      resolve: undefined,
      reject: undefined,
    };
  },
  getters: {
    isActive: (state: ModalWindowState): boolean => {
      return state.active;
    },
    getData: (state: ModalWindowState): ModalWindowData | undefined => {
      return state.data;
    },
    getResolve: (state: ModalWindowState): Function | undefined => {
      return state.resolve;
    },
    getReject: (state: ModalWindowState): Function | undefined => {
      return state.reject;
    },
  },
  actions: {
    openModal<T = any>(data?: ModalWindowData, closeOnResult: boolean = true): Promise<any> {
      if (data) {
        const { component, props, title } = data;
        this.data = {
          component,
          props,
          title,
        };
      }
      this.active = true;
      const _this = this;
      const promise = new Promise<T>((resolve, reject) => {
        _this.resolve = resolve;
        _this.reject = reject;
      }).then(() => {
        if (closeOnResult) {
          _this.closeModal();
        }
      });
      return promise;
    },
    closeModal() {
      this.active = false;
      this.data = {};
      this.resolve = undefined;
      this.reject = undefined;
    },
  },
});