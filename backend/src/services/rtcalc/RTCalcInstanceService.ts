import RTCalcInstanceRepository from "@src/repositories/rtcalc/RTCalcInstanceRepository.js";
import Service from "../Service.js";
import {
  RTCalcInstanceHubModel,
  RTCalcInstanceModel,
} from "@src/models/db/index.js";
import RTCalcInstanceHubService from "./RTCalcInstanceHubService.js";

export default class RTCalcInstanceService extends Service<
  RTCalcInstanceModel,
  RTCalcInstanceRepository
> {
  constructor() {
    super(new RTCalcInstanceRepository());
  }

  getRTCalcInstanceWithLeastHubs(): Promise<number | undefined> {
    return this.repo.getRTCalcInstanceWithLeastHubs();
  }

  /**
   *
   * @param hubId
   * @returns rtcalc instance uuid
   */
  async assignHubToRTCalcInstance(hubId: number): Promise<string | undefined> {
    const rtCalcInstanceHubService = new RTCalcInstanceHubService();
    const existingAssignment = await rtCalcInstanceHubService.getBy(
      "main_map_hub_id",
      hubId,
    );

    // is hub already assigned
    if (existingAssignment?.rtcalc_instance_id) {
      const rtCalcInstance = await this.get(
        existingAssignment?.rtcalc_instance_id,
      );
      return rtCalcInstance.uuid;
    }

    // find rtcalc to assign hub to
    const rtcalcIdWithLeastHubs = await this.getRTCalcInstanceWithLeastHubs();

    // can't find rtcalc
    if (!rtcalcIdWithLeastHubs) {
      const firstRTCalcInstance = (await this.getAll(0, 1))?.[0];
      return firstRTCalcInstance?.uuid;
    }

    // create assignment of hub to rtcalc
    const newAssignedRTCalcHub = new RTCalcInstanceHubModel();
    newAssignedRTCalcHub.main_map_hub_id = hubId;
    newAssignedRTCalcHub.rtcalc_instance_id = rtcalcIdWithLeastHubs;

    await rtCalcInstanceHubService.create(newAssignedRTCalcHub);

    return (await this.get(rtcalcIdWithLeastHubs))?.uuid;
  }

  async createNewRTCalcInstance(uuid: string) {
    let rtcalcInstance = new RTCalcInstanceModel();
    rtcalcInstance.uuid = uuid;
    rtcalcInstance = await this.create(rtcalcInstance);
    return rtcalcInstance;
  }
}
