import type { ResponseAPI } from "extorris";
import LocalAlertTypes from "~/core/models/local_alerts/LocalAlertTypes";

export function handleAPIError(errorData: ResponseAPI) {
  if (!errorData) {
    return;
  }
  console.log(errorData);
  const title = `${errorData.status} status`;
  let message = errorData.result.message;
  if (!message) {
    switch (errorData.status) {
      case 440: {
        message = "Session expired";
      }
    }
  }
  createAlert(message, LocalAlertTypes.ERROR, title);
}
