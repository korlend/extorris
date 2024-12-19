import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class GuildModel
  extends DBModel<GuildModel>
  implements IParsable<GuildModel>
{
  _tableName: string = "guilds";
  _entityType: EntityType = EntityType.GUILD;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.STRING)
  name: string = "";

  @FieldType(FieldTypes.STRING)
  description: string = "";

  parseObject(object: any): GuildModel {
    const instance = new GuildModel();
    instance.id = object.id;
    instance.name = object.name;
    instance.description = object.description;
    return instance;
  }
}