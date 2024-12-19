import DummyModel from "@src/models/db/DummyModel.js";
import Repository from "./Repository.js";

export default class DummyRepository extends Repository<DummyModel> {
  constructor() {
    super(new DummyModel());
  }
}
