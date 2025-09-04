import { RTCalcInstanceHubModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class RTCalcInstanceHubRepository extends Repository<RTCalcInstanceHubModel> {
  constructor() {
    super(new RTCalcInstanceHubModel());
  }
}
