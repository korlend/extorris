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
  _tableName: string = "images";
  _entityType: EntityType = EntityType.IMAGE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.IMAGE_PATH)
  relative_path: string = "";

  @FieldType(FieldTypes.STRING)
  name?: string;

  @FieldType(FieldTypes.INT)
  width?: number;

  @FieldType(FieldTypes.INT)
  height?: number;

  @FieldType(FieldTypes.BOOLEAN)
  is_temp?: boolean = false;

  @FieldType(FieldTypes.INT)
  size?: number;

  parseObject(object: any): GuildModel {
    const instance = new GuildModel();
    instance.id = object.id;
    instance.relative_path = object.relative_path;
    instance.name = object.name;
    instance.width = object.width;
    instance.height = object.height;
    instance.is_temp = object.is_temp;
    instance.size = object.size;
    return instance;
  }
}
