import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class ExternalCreatureModel
  extends DBModel<ExternalCreatureModel>
  implements IParsable<ExternalCreatureModel>
{
  _tableName: string = "external_creatures";
  _entityType: EntityType = EntityType.EXTERNAL_CREATURE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  parseObject(object: any): ExternalCreatureModel {
    const instance = new ExternalCreatureModel();
    instance.id = object.id;
    return instance;
  }
}
