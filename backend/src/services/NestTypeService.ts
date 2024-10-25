import NestTypeModel from "@src/models/db/NestTypeModel.js";
import NestTypeRepository from "@src/repositories/NestTypeRepository.js";
import Service from "./Service.js";

export default class NestTypeService extends Service<
  NestTypeModel,
  NestTypeRepository
> {
  sessionRepo = new NestTypeRepository();

  constructor() {
    super(new NestTypeRepository());
  }
}
