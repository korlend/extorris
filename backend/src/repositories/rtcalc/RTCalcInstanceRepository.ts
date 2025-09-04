import { RTCalcInstanceModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";
import RTCalcInstanceHubRepository from "./RTCalcInstanceHubRepository.js";

export default class RTCalcInstanceRepository extends Repository<RTCalcInstanceModel> {
  private rtcalcInstanceHubRepository = new RTCalcInstanceHubRepository();

  constructor() {
    super(new RTCalcInstanceModel());
  }

  getRTCalcInstanceWithLeastHubs(): Promise<number> {
    return this.connector
      .query(
        `
        select ri.id, count(rih.id) as amount from ${this.target} ri
        left join ${this.rtcalcInstanceHubRepository.target} rih on ri.id = rih.rtcalc_instance_id
        group by ri.id
        order by amount
        limit 1
      `,
      )
      .then(async (resp) => (await this.modelFromDataPacket(resp))?.id);
  }
}
