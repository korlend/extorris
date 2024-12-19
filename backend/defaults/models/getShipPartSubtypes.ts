import ShipPartSubtypes from "@src/enums/ShipPartSubtypes.js";
import { ShipPartSubtypeModel } from "@src/models/db/index.js";

const generateDefaults = () => {
  const array: Array<ShipPartSubtypeModel> = [];
  const subtypes = Object.values(ShipPartSubtypes)
  for (let i = 0; i < subtypes.length; i++) {
    const partSubtype = new ShipPartSubtypeModel();
    partSubtype.code_name = subtypes[i];
    array.push(partSubtype);
  }
  return array;
}

export default generateDefaults;
