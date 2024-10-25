import InlandCreatureModel from "@src/models/db/InlandCreatureModel.js";
import Repository from "./Repository.js";

export default class InlandCreatureRepository extends Repository<InlandCreatureModel> {
  constructor() {
    super(new InlandCreatureModel(), "inland_creatures");
  }
}
