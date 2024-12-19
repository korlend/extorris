import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";

export default class ShipPartSubtypeModel
  extends DBModel<ShipPartSubtypeModel>
  implements IParsable<ShipPartSubtypeModel>
{
  _tableName: string = "ship_part_subtypes";
  _entityType: EntityType = EntityType.SHIP_PART_SUBTYPE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.TRANSLATION,
  })
  name_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.IMAGE,
  })
  image_id?: number;

  @FieldType(FieldTypes.STRING)
  code_name: string = "";

  parseObject(object: any): ShipPartSubtypeModel {
    const instance = new ShipPartSubtypeModel();
    instance.id = object.id;
    instance.name_id = object.name_id;
    instance.image_id = object.image_id;
    instance.code_name = object.code_name;
    return instance;
  }
}
