import { CronJob } from "cron";
import persistShipPositions from "./persistShipPositions.js";
import assignHubsToRTCalcInstances from "./assignHubsToRTCalcInstances.js";

const jobs: Array<CronJob> = [
  persistShipPositions,
  assignHubsToRTCalcInstances,
];

export default jobs;
