import {
  ShipArmorModel,
} from "@src/models/db/index.js";

const generateDefaults = (userId?: number) => {

  let array: Array<ShipArmorModel> = [];
  {
    const shipArmor = new ShipArmorModel();
    shipArmor.code_name = "default_armor_1";
    shipArmor.defense = 10;
    array.push(shipArmor);
  }
  if (userId) {
    for (let i = 0; i < array.length; i++) {
      array[i].user_id = userId;
    }
  }
  return array;
};

export default generateDefaults;
