import { ExternalCreatureModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ExternalCreatureRepository extends Repository<ExternalCreatureModel> {
  constructor() {
    super(new ExternalCreatureModel());
  }
}
