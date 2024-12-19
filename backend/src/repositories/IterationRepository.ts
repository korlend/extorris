import { IterationModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class IterationRepository extends Repository<IterationModel> {
  constructor() {
    super(new IterationModel());
  }
}
