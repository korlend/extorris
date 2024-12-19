import { NestTypeModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class NestTypeRepository extends Repository<NestTypeModel> {
  constructor() {
    super(new NestTypeModel());
  }
}
