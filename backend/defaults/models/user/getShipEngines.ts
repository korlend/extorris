import {
  ShipEngineModel,
} from "@src/models/db/index.js";

const generateDefaults = (userId?: number) => {

  const array: Array<ShipEngineModel> = [];
  {
    const shipEngine = new ShipEngineModel();
    shipEngine.code_name = "default_engine_1";
    shipEngine.max_speed = 30;
    shipEngine.acceleration = 5;
    shipEngine.energy_consumption = 100;
    array.push(shipEngine);
  }
  if (userId) {
    for (let i = 0; i < array.length; i++) {
      array[i].user_id = userId;
    }
  }
  return array;
};

export default generateDefaults;
