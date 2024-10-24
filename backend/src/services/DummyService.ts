import DummyModel from "@src/models/db/DummyModel.js";
import DummyRepository from "@src/repositories/DummyRepository.js";
import Service from "./Service.js";

export default class DummyService extends Service<
  DummyModel,
  DummyRepository
> {
  sessionRepo = new DummyRepository();

  constructor() {
    super(new DummyRepository());
  }
}
