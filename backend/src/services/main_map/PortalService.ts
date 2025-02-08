import { PortalModel } from "@src/models/db/index.js";
import PortalRepository from "@src/repositories/main_map/PortalRepository.js";
import Service from "../Service.js";

export default class PortalService extends Service<
  PortalModel,
  PortalRepository
> {
  constructor() {
    super(new PortalRepository());
  }
}
