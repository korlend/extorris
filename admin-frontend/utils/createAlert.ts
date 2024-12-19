import { useLocalAlertsStore } from "@/store/local_alerts";
import type LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

export function createAlert(
  text: string,
  type: LocalAlertTypes,
  title?: string,
  duration: number = 10
) {
  const localAlertsStore = useLocalAlertsStore();
  localAlertsStore.createAlert(text, type, title, duration);
}
