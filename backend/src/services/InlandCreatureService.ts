import InlandCreatureModel from "@src/models/db/InlandCreatureModel.js";
import InlandCreatureRepository from "@src/repositories/InlandCreatureRepository.js";
import Service from "./Service.js";

export default class InlandCreatureService extends Service<
  InlandCreatureModel,
  InlandCreatureRepository
> {
  sessionRepo = new InlandCreatureRepository();

  constructor() {
    super(new InlandCreatureRepository());
  }
}
