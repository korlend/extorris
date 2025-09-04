import RTCalcInstanceHubRepository from "@src/repositories/rtcalc/RTCalcInstanceHubRepository.js";
import Service from "../Service.js";
import { RTCalcInstanceHubModel } from "@src/models/db/index.js";

export default class RTCalcInstanceHubService extends Service<
  RTCalcInstanceHubModel,
  RTCalcInstanceHubRepository
> {
  constructor() {
    super(new RTCalcInstanceHubRepository());
  }
}
