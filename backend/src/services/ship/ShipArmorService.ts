import { ShipArmorModel, UserModel } from "@src/models/db/index.js";
import ShipArmorRepository from "@src/repositories/ship/ShipArmorRepository.js";
import Service from "../Service.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import ShipService from "./ShipService.js";

export default class ShipArmorService extends Service<
  ShipArmorModel,
  ShipArmorRepository
> {
  constructor() {
    super(new ShipArmorRepository());
  }

  async unequipAll(user: UserModel) {
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    const filters: Array<DBFilter<ShipArmorModel>> = [];
    filters.push(new DBFilter("ship_id", userShip.id));

    const shipParts = await this.getSearchAll(new SearchRequestData(), undefined, filters);
    for (let i = 0; i < shipParts.items.length; i++) {
      const shipPart = shipParts.items[i];
      shipPart.ship_id = null;
      await this.update(shipPart);
    }
    console.log("unequipped armors")
  }

  async equip(user: UserModel, part: ShipArmorModel) {
    await this.unequipAll(user);
    const shipService = new ShipService();
    const userShip = await shipService.getBy("user_id", user.id);

    part.ship_id = userShip.id;
    const resp = await this.update(part, new ParametersLimit([], ["ship_id"]));
    console.log("equipped armor", resp)

  }
}
