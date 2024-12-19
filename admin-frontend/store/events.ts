import { defineStore } from "pinia";

interface EventData {
  target?: any;
}

export interface EventsState {
  events: Record<string, EventData>;
}

export const useEventsStore = defineStore("events", {
  state: (): EventsState => {
    return {
      events: {},
    };
  },
  getters: {
    getEvents(): Record<string, EventData> {
      return this.events;
    },
  },
  actions: {
    getCreateEvent(name: string): EventData {
      const event = this.events[name];
      if (!event) {
        this.events[name] = {};
      }
      return this.events[name];
    },
    triggerEvent(name: string, target?: any): void {
      const event = this.getCreateEvent(name);
      if (!target) {
        event.target = typeof event.target === "number" ? event.target++ : 0;
      } else {
        event.target = target;
      }
    },
  },
});
