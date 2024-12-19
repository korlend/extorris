import ShipPartSubtypes from "@src/enums/ShipPartSubtypes.js";
import {
  ShipPartSubtypeModel,
  ShipPartTypeModel,
} from "@src/models/db/index.js";

const generateDefaults = (shipPartSubtypes: Array<ShipPartSubtypeModel>) => {
  const mappedCodeSubtypes: Record<string, ShipPartSubtypeModel> = {};
  for (let i = 0; i < shipPartSubtypes.length; i++) {
    const subtype = shipPartSubtypes[i];
    mappedCodeSubtypes[subtype.code_name] = subtype;
  }
  const mappedSubtypes: Record<ShipPartSubtypes, ShipPartSubtypeModel> = {
    [ShipPartSubtypes.ARMOR]: mappedCodeSubtypes[ShipPartSubtypes.ARMOR],
    [ShipPartSubtypes.CROSSBOW_CANNON]:
      mappedCodeSubtypes[ShipPartSubtypes.CROSSBOW_CANNON],
    [ShipPartSubtypes.ENGINE]: mappedCodeSubtypes[ShipPartSubtypes.ENGINE],
    [ShipPartSubtypes.HULL]: mappedCodeSubtypes[ShipPartSubtypes.HULL],
    [ShipPartSubtypes.REACTOR]: mappedCodeSubtypes[ShipPartSubtypes.REACTOR],
    [ShipPartSubtypes.WINGS]: mappedCodeSubtypes[ShipPartSubtypes.WINGS],
  };

  const array: Array<ShipPartTypeModel> = [];
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_wings";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.WINGS].id;
    shipPartType.speed_change = 50;
    shipPartType.physical_defense_change = 0;
    shipPartType.maximum_crew_change = 2;
    shipPartType.max_weight_change = 50;
    shipPartType.attack_power_change = 0;
    shipPartType.energy_consumption_change = 0;
    array.push(shipPartType);
  }
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_engine";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.ENGINE].id;
    shipPartType.speed_change = 70;
    shipPartType.physical_defense_change = 0;
    shipPartType.maximum_crew_change = 3;
    shipPartType.max_weight_change = 100;
    shipPartType.attack_power_change = 0;
    shipPartType.energy_consumption_change = 100;
    array.push(shipPartType);
  }
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_hull";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.HULL].id;
    shipPartType.speed_change = 20;
    shipPartType.physical_defense_change = 50;
    shipPartType.maximum_crew_change = 15;
    shipPartType.max_weight_change = 1500;
    shipPartType.attack_power_change = 0;
    shipPartType.energy_consumption_change = 0;
    array.push(shipPartType);
  }
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_reactor";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.REACTOR].id;
    shipPartType.speed_change = 0;
    shipPartType.physical_defense_change = 0;
    shipPartType.maximum_crew_change = 0;
    shipPartType.max_weight_change = -100;
    shipPartType.attack_power_change = 0;
    shipPartType.energy_consumption_change = -500;
    array.push(shipPartType);
  }
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_armor";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.ARMOR].id;
    shipPartType.speed_change = -20;
    shipPartType.physical_defense_change = 150;
    shipPartType.maximum_crew_change = 0;
    shipPartType.max_weight_change = -300;
    shipPartType.attack_power_change = 0;
    shipPartType.energy_consumption_change = 0;
    array.push(shipPartType);
  }
  {
    const shipPartType = new ShipPartTypeModel();
    shipPartType.code_name = "default_crossbow_cannon";
    shipPartType.subtype_id = mappedSubtypes[ShipPartSubtypes.CROSSBOW_CANNON].id;
    shipPartType.speed_change = 0;
    shipPartType.physical_defense_change = 0;
    shipPartType.maximum_crew_change = 0;
    shipPartType.max_weight_change = -10;
    shipPartType.attack_power_change = 10;
    shipPartType.energy_consumption_change = 5;
    array.push(shipPartType);
  }
  return array;
};

export default generateDefaults;
