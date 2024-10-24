import { defineStore } from "pinia";
import LocalAlert from "~/models/local_alerts/LocalAlert";
import type LocalAlertTypes from "~/models/local_alerts/LocalAlertTypes";

interface AlertsState {
  alerts: Array<LocalAlert>;
}

export const useLocalAlertsStore = defineStore("local_alerts", {
  state: (): AlertsState => {
    return {
      alerts: [],
    };
  },
  getters: {
    getAlerts: (state: AlertsState): Array<LocalAlert> => {
      return state.alerts;
    },
  },
  actions: {
    createAlert(text: string, type: LocalAlertTypes, title?: string, duration: number = 1000) {
      const alert = new LocalAlert(text, type, title, duration);
      this.alerts.push(alert);
    },
    removeAlert(uuid: string) {
      const index = this.alerts.findIndex((v) => v.uuid === uuid);
      if (index === -1) {
        return;
      }
      this.alerts.splice(index, 1);
    },
    // duration in seconds
    extendAlert(uuid: string, duration: number) {
      const alert = this.alerts.find((v) => v.uuid === uuid);

      if (!alert) {
        return;
      }

      alert.end_date = new Date(new Date().getTime() + duration * 1000);
    },
  },
});
