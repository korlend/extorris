import { ShipHullModel, UserModel } from "@src/models/db/index.js";
import ShipHullRepository from "@src/repositories/ship/ShipHullRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import ShipService from "./ShipService.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import ShipCannonService from "./ShipCannonService.js";

export default class ShipHullService extends Service<
  ShipHullModel,
  ShipHullRepository
> {
  constructor() {
    super(new ShipHullRepository());
  }

  async unequipAll(user: UserModel) {
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const filters: Array<DBFilter<ShipHullModel>> = [];
    filters.push(new DBFilter("ship_id", userShip.id));

    const shipParts = await this.getSearchAll(new SearchRequestData(), undefined, filters);
    for (let i = 0; i < shipParts.items.length; i++) {
      const shipPart = shipParts.items[i];
      shipPart.ship_id = null;
      await this.update(shipPart);
    }
  }

  async equip(user: UserModel, part: ShipHullModel) {
    await this.unequipAll(user);
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const shipCannonService = new ShipCannonService();
    await shipCannonService.unequipAll(user);

    part.ship_id = userShip.id;
    await this.update(part, new ParametersLimit<ShipHullModel>([], ["ship_id"]));
  }
}
