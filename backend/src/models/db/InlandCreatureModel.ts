import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class InlandCreatureModel
  extends DBModel<InlandCreatureModel>
  implements IParsable<InlandCreatureModel>
{
  _tableName: string = "inland_creatures";
  _entityType: EntityType = EntityType.INLAND_CREATURE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  parseObject(object: any): InlandCreatureModel {
    const instance = new InlandCreatureModel();
    instance.id = object.id;
    return instance;
  }
}
