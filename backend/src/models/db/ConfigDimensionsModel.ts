import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { ConfigDimensionsTypes, FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ConfigDimensionsModel extends DBModel<ConfigDimensionsModel> {
  _tableName: string = "config_dimensions";
  _entityType: EntityType = EntityType.CONFIG_DIMENSIONS;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.STRING_SELECT, {
    stringList: Object.values(ConfigDimensionsTypes),
  })
  name: ConfigDimensionsTypes | null = null;

  value: number = 0;

  parseObject(object: DBModelOnlyDBData<ConfigDimensionsModel>): ConfigDimensionsModel {
    const instance = new ConfigDimensionsModel();
    instance.id = object.id;
    instance.name = object.name;
    instance.value = object.value;
    return instance;
  }
}
