import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";
import { FieldTypes } from "extorris-common";
import DBModel from "../DBModel.js";

export default class RTCalcInstanceModel extends DBModel<RTCalcInstanceModel> {
  _tableName: string = "rtcalc_instances";
  _entityType: EntityType = EntityType.RTCALC_INSTANCE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.PRIMARY_KEY)
  uuid: string = "";

  @Immutable
  @FieldType(FieldTypes.DATE)
  created: Date = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated: Date = new Date();

  @FieldType(FieldTypes.DATE)
  last_check: Date = new Date();

  parseObject(
    object: DBModelOnlyDBData<RTCalcInstanceModel>,
  ): RTCalcInstanceModel {
    const instance = new RTCalcInstanceModel();
    instance.id = object.id;
    instance.uuid = object.uuid;
    instance.created = object.created;
    instance.updated = object.updated;
    instance.last_check = object.last_check;
    return instance;
  }
}
