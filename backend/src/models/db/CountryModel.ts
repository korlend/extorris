import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class CountryModel extends DBModel<CountryModel> {
  _tableName: string = "countries";
  _entityType: EntityType = EntityType.COUNTRY;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.STRING)
  code: string = "";

  @FieldType(FieldTypes.STRING)
  name: string = "";

  parseObject(object: DBModelOnlyDBData<CountryModel>): CountryModel {
    const instance = new CountryModel();
    instance.id = object.id;
    instance.code = object.code;
    instance.name = object.name;
    return instance;
  }
}
