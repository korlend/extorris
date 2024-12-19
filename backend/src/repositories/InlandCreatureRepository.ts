import { InlandCreatureModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class InlandCreatureRepository extends Repository<InlandCreatureModel> {
  constructor() {
    super(new InlandCreatureModel());
  }
}
