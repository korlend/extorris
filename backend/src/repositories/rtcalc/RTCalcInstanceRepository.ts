import { RTCalcInstanceModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class RTCalcInstanceRepository extends Repository<RTCalcInstanceModel> {
  constructor() {
    super(new RTCalcInstanceModel());
  }
}
