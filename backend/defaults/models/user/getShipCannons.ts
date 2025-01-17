import {
  ShipCannonModel,
} from "@src/models/db/index.js";

const generateDefaults = (userId?: number) => {

  const array: Array<ShipCannonModel> = [];
  {
    const shipCannon = new ShipCannonModel();
    shipCannon.code_name = "default_cannon_1";
    shipCannon.attack_power = 1;
    shipCannon.energy_consumption_per_action = 10;
    shipCannon.action_cooldown = 5000;
    array.push(shipCannon);
  }
  if (userId) {
    for (let i = 0; i < array.length; i++) {
      array[i].user_id = userId;
    }
  }
  return array;
};

export default generateDefaults;
