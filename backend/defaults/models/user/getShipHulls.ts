import {
  ShipHullModel,
} from "@src/models/db/index.js";

const generateDefaults = (userId?: number) => {

  const array: Array<ShipHullModel> = [];
  {
    const shipHull = new ShipHullModel();
    shipHull.code_name = "default_hull_1";
    shipHull.cannon_slots = 2;
    shipHull.energy_consumption_factor = 1.0;
    shipHull.maximum_crew = 5;
    shipHull.speed_factor = 1.0;
    shipHull.health_points = 1000;
    array.push(shipHull);
  }
  if (userId) {
    for (let i = 0; i < array.length; i++) {
      array[i].user_id = userId;
    }
  }
  return array;
};

export default generateDefaults;
