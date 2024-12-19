import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class TreeModel
  extends DBModel<TreeModel>
  implements IParsable<TreeModel>
{
  _tableName: string = "trees";
  _entityType: EntityType = EntityType.TREE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.INT)
  on_depth: number = 0;

  @FieldType(FieldTypes.INT)
  hub_number?: number;

  parseObject(object: any): TreeModel {
    const instance = new TreeModel();
    instance.id = object.id;
    instance.on_depth = object.on_depth;
    instance.hub_number = object.hub_number;
    return instance;
  }
}