import type { Component, Prop } from "vue";

export default class SlidebarTab {
  uuid: string = window.crypto.randomUUID();
  component: Component;
  props: Record<string, any>;
  tabName?: string;

  constructor(component: Component, props: Record<string, any> = {}, tabName?: string) {
    this.component = component;
    this.props = props;
    this.tabName = tabName;
  }
}
