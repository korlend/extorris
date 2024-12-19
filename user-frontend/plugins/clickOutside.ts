import type { DirectiveBinding } from "vue";

const stopPropagation = (event: MouseEvent) => {
  event.stopPropagation();
};

let clickOutsideFunctions: Map<HTMLElement, (event: MouseEvent) => void> =
  new Map();

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, Function>("on-click-outside", {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      el.addEventListener("click", stopPropagation);
      const clickOutside = (event: MouseEvent) => {
        if (event.target !== el && binding.value instanceof Function) {
          binding.value();
        }
      };
      clickOutsideFunctions.set(el, clickOutside);
      window.addEventListener("click", clickOutside);
    },
    unmounted(el: HTMLElement) {
      el.removeEventListener("click", stopPropagation);
      const clickOutside = clickOutsideFunctions.get(el);
      if (clickOutside instanceof Function) {
        window.removeEventListener("click", clickOutside);
        clickOutsideFunctions.delete(el);
      }
    },
  });
});
