import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class TranslationModel
  extends DBModel<TranslationModel>
  implements IParsable<TranslationModel>
{
  _tableName: string = "translations";
  _entityType: EntityType = EntityType.TRANSLATION;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.STRING)
  code_name: string = "";

  @FieldType(FieldTypes.STRING)
  description: string = "";

  @FieldType(FieldTypes.STRING)
  text: string = "";

  parseObject(object: any): TranslationModel {
    const instance = new TranslationModel();
    instance.id = object.id;
    instance.code_name = object.code_name;
    instance.description = object.description;
    instance.text = object.text;
    return instance;
  }
}