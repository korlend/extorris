import NestModel from "@src/models/db/NestModel.js";
import Repository from "./Repository.js";

export default class NestRepository extends Repository<NestModel> {
  constructor() {
    super(new NestModel(), "nests");
  }
}
