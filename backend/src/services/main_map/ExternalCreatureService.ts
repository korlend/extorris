import { ExternalCreatureModel } from "@src/models/db/index.js";
import ExternalCreatureRepository from "@src/repositories/main_map/ExternalCreatureRepository.js";
import Service from "../Service.js";

export default class ExternalCreatureService extends Service<
  ExternalCreatureModel,
  ExternalCreatureRepository
> {
  constructor() {
    super(new ExternalCreatureRepository());
  }
}
