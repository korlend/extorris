import NestModel from "@src/models/db/NestModel.js";
import NestRepository from "@src/repositories/NestRepository.js";
import Service from "./Service.js";

export default class NestService extends Service<
  NestModel,
  NestRepository
> {
  constructor() {
    super(new NestRepository());
  }
}
