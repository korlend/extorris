import {
  ShipEnergyCoreModel,
} from "@src/models/db/index.js";

const generateDefaults = (userId?: number) => {

  const array: Array<ShipEnergyCoreModel> = [];
  {
    const shipEnergyCore = new ShipEnergyCoreModel();
    shipEnergyCore.code_name = "default_energy_core_1";
    shipEnergyCore.energy_capacity = 200;
    shipEnergyCore.energy_production = 30;
    array.push(shipEnergyCore);
  }
  if (userId) {
    for (let i = 0; i < array.length; i++) {
      array[i].user_id = userId;
    }
  }
  return array;
};

export default generateDefaults;
