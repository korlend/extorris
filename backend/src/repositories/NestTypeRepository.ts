import NestTypeModel from "@src/models/db/NestTypeModel.js";
import Repository from "./Repository.js";

export default class NestTypeRepository extends Repository<NestTypeModel> {
  constructor() {
    super(new NestTypeModel(), "nest_types");
  }
}
