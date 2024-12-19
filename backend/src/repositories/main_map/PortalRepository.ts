import { PortalModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class PortalRepository extends Repository<PortalModel> {
  constructor() {
    super(new PortalModel());
  }
}
