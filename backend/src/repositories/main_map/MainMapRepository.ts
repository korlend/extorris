import { MainMapModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class MainMapRepository extends Repository<MainMapModel> {
  constructor() {
    super(new MainMapModel());
  }
}
