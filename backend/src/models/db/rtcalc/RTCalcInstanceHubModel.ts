import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";
import { FieldTypes } from "extorris-common";
import DBModel from "../DBModel.js";

export default class RTCalcInstanceHubModel extends DBModel<RTCalcInstanceHubModel> {
  _tableName: string = "rtcalc_instances_hubs";
  _entityType: EntityType = EntityType.RTCALC_INSTANCE_HUB;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.RTCALC_INSTANCE,
  })
  rtcalc_instance_id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.MAIN_MAP_HUB,
  })
  main_map_hub_id?: number;

  parseObject(
    object: DBModelOnlyDBData<RTCalcInstanceHubModel>,
  ): RTCalcInstanceHubModel {
    const instance = new RTCalcInstanceHubModel();
    instance.id = object.id;
    instance.rtcalc_instance_id = object.rtcalc_instance_id;
    instance.main_map_hub_id = object.main_map_hub_id;
    return instance;
  }
}
