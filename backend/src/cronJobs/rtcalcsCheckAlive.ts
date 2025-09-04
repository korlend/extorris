import RedisConnector from "@src/core/RedisConnector.js";
import { RTCalcInstanceModel } from "@src/models/db/index.js";
import RTCalcInstanceService from "@src/services/rtcalc/RTCalcInstanceService.js";
import { CronJob } from "cron";
import { RTCalcInstructionsTypes } from "extorris-common";

export default CronJob.from({
  cronTime: "*/1 * * * * *",
  onTick: async () => {
    const redis = await RedisConnector.getInstance();
    const rtcalcInstanceService = new RTCalcInstanceService();

    const rtcalcInstances = await rtcalcInstanceService.getAll(0, 10000);
    const now = new Date();
    const instancesToDelete: Array<RTCalcInstanceModel> = [];
    for (let i = 0; i < rtcalcInstances.length; i++) {
      const instance = rtcalcInstances[i];
      const checkAliveDiff = now.getTime() - instance.last_check.getTime();
      if (checkAliveDiff > 5000) {
        instancesToDelete.push(instance);
      } else {
        await redis.writeRTCalcInstruction(instance.uuid, {
          type: RTCalcInstructionsTypes.CHECK_ALIVE,
        });
      }
    }
    await rtcalcInstanceService.deleteAll(instancesToDelete);
  },
});
