import { v4 as uuidv4 } from "uuid";
import type { Component, Prop } from "vue";

export default class SlidebarTab {
  uuid: string = uuidv4();
  component: Component;
  props: Record<string, any>;
  tabName?: string;

  constructor(component: Component, props: Record<string, any> = {}, tabName?: string) {
    this.component = component;
    this.props = props;
    this.tabName = tabName;
  }
}
