import PasswordHelper from "@src/core/utils/PasswordHelper.js";
import { ConfigDimensionsModel } from "@src/models/db/index.js";
import { ConfigDimensionsTypes } from "extorris-common";

const generateDefaults = async () => {
  const array: Array<ConfigDimensionsModel> = [];
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.PORTAL_COLLISION_RADIUS;
    record.value = 200;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.PORTAL_DISPLAY_X;
    record.value = 200;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.PORTAL_DISPLAY_Y;
    record.value = 300;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.SHIP_DISPLAY_X;
    record.value = 180;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.SHIP_DISPLAY_Y;
    record.value = 321;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.SHIP_HOVER_RADIUS;
    record.value = 150;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_X;
    record.value = 450;
    array.push(record);
  }
  {
    const record = new ConfigDimensionsModel();
    record.name = ConfigDimensionsTypes.SHIP_SPAWN_DISTANCE_Y;
    record.value = 450;
    array.push(record);
  }
  return array;
};

export default generateDefaults;
