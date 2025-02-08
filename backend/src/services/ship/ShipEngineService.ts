import { ShipEngineModel, UserModel } from "@src/models/db/index.js";
import ShipEngineRepository from "@src/repositories/ship/ShipEngineRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import ShipService from "./ShipService.js";

export default class ShipEngineService extends Service<
  ShipEngineModel,
  ShipEngineRepository
> {
  constructor() {
    super(new ShipEngineRepository());
  }

  async unequipAll(user: UserModel) {
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const filters: Array<DBFilter<ShipEngineModel>> = [];
    filters.push(new DBFilter("ship_id", userShip.id));

    const shipParts = await this.getSearchAll(new SearchRequestData(), undefined, filters);
    for (let i = 0; i < shipParts.items.length; i++) {
      const shipPart = shipParts.items[i];
      shipPart.ship_id = null;
      await this.update(shipPart);
    }
  }

  async equip(user: UserModel, part: ShipEngineModel) {
    await this.unequipAll(user);
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    part.ship_id = userShip.id;
    await this.update(part, new ParametersLimit([], ["ship_id"]));
  }
}
