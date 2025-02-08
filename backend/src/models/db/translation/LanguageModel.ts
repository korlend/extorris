import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class LanguageModel extends DBModel<LanguageModel> {
  _tableName: string = "languages";
  _entityType: EntityType = EntityType.LANGUAGE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.COUNTRY })
  country_id?: number;

  @FieldType(FieldTypes.STRING)
  name: string = "";

  @FieldType(FieldTypes.STRING)
  code: string = "";

  parseObject(object: DBModelOnlyDBData<LanguageModel>): LanguageModel {
    const instance = new LanguageModel();
    instance.id = object.id;
    instance.country_id = object.country_id;
    instance.name = object.name;
    instance.code = object.code;
    return instance;
  }
}
