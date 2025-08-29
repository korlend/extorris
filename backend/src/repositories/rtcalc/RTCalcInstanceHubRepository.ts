import { RTCalcInstanceHubModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class RTCalcInstanceHubRepository extends Repository<RTCalcInstanceHubModel> {
  constructor() {
    super(new RTCalcInstanceHubModel());
  }

  getRTCalcInstanceWithLeastHubs(): Promise<number> {
    return this.connector
      .query(
        `
        select rih.rtcalc_instance_id, count(*) as amount from ${this.target} rih
        group by rih.rtcalc_instance_id
        order by amount asc
        limit 1
      `,
      )
      .then(
        async (resp) =>
          (await this.modelFromDataPacket(resp))?.rtcalc_instance_id,
      );
  }
}
