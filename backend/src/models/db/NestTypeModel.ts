import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class NestTypeModel extends DBModel<NestTypeModel> {
  _tableName: string = "nest_types";
  _entityType: EntityType = EntityType.NEST_TYPE;

  @Immutable
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.EXTERNAL_CREATURE,
  })
  external_creature_id?: number;

  parseObject(object: DBModelOnlyDBData<NestTypeModel>): NestTypeModel {
    const instance = new NestTypeModel();
    instance.id = object.id;
    instance.external_creature_id = object.external_creature_id;
    return instance;
  }
}
