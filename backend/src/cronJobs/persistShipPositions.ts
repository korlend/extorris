import ShipService from "@src/services/ship/ShipService.js";
import { CronJob } from "cron";

export default CronJob.from({
  cronTime: "*/10 * * * * *",
  onTick: function () {
    const shipService = new ShipService();
    shipService.persistShipsPositions();
  },
});
