import { CronJob } from "cron";
import persistShipPositions from "./persistShipPositions.js";
import assignHubsToRTCalcInstances from "./assignHubsToRTCalcInstances.js";
import rtcalcsCheckAlive from "./rtcalcsCheckAlive.js";

const jobs: Array<CronJob> = [
  persistShipPositions,
  assignHubsToRTCalcInstances,
  rtcalcsCheckAlive,
];

export default jobs;
