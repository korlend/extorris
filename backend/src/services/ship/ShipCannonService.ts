import { ShipCannonModel, UserModel } from "@src/models/db/index.js";
import ShipCannonRepository from "@src/repositories/ship/ShipCannonRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import ShipService from "./ShipService.js";
import ShipHullService from "./ShipHullService.js";

export default class ShipCannonService extends Service<
  ShipCannonModel,
  ShipCannonRepository
> {
  constructor() {
    super(new ShipCannonRepository());
  }

  async unequipAll(user: UserModel) {
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const filters: Array<DBFilter<ShipCannonModel>> = [];
    filters.push(new DBFilter("ship_id", userShip.id));

    const shipParts = await this.getSearchAll(new SearchRequestData(), filters);
    for (let i = 0; i < shipParts.items.length; i++) {
      const shipPart = shipParts.items[i];
      shipPart.ship_id = null;
      await this.update(shipPart);
    }
  }

  async equip(user: UserModel, part: ShipCannonModel) {
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const shipHullService = new ShipHullService();
    const equippedShipHull = await shipHullService.getBy("ship_id", userShip.id);

    const shipCannonService = new ShipCannonService();
    const shipCannonFilters: Array<DBFilter<ShipCannonModel>> = [];
    shipCannonFilters.push(new DBFilter("ship_id", userShip.id));

    const shipCannons = await shipCannonService.getSearchAll(new SearchRequestData(), shipCannonFilters);

    const diffInSlots = equippedShipHull.cannon_slots - shipCannons.items.length;
    if (diffInSlots < 0) {
      await this.unequipAll(user);
    } else if (diffInSlots > 0) {
      part.ship_id = userShip.id;
      await shipCannonService.update(part, new ParametersLimit(["ship_id"]));
    }
  }

  async unequip(part: ShipCannonModel) {
    part.ship_id = null;
    await this.update(part);
  }
}
