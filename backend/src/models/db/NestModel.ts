import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class NestModel extends DBModel<NestModel> {
  _tableName: string = "nests";
  _entityType: EntityType = EntityType.NEST;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.NEST_TYPE,
  })
  nest_type_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.TREE })
  tree_id?: number;

  parseObject(object: DBModelOnlyDBData<NestModel>): NestModel {
    const instance = new NestModel();
    instance.id = object.id;
    instance.nest_type_id = object.nest_type_id;
    instance.tree_id = object.tree_id;
    return instance;
  }
}
