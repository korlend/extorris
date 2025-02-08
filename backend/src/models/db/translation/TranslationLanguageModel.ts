import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class TranslationLanguageModel extends DBModel<TranslationLanguageModel> {
  _tableName: string = "translations_languages";
  _entityType: EntityType = EntityType.TRANSLATION_LANGUAGE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.LANGUAGE })
  language_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.TRANSLATION,
  })
  translation_id?: number;

  @FieldType(FieldTypes.STRING)
  text: string = "";

  parseObject(
    object: DBModelOnlyDBData<TranslationLanguageModel>,
  ): TranslationLanguageModel {
    const instance = new TranslationLanguageModel();
    instance.id = object.id;
    instance.language_id = object.language_id;
    instance.translation_id = object.translation_id;
    instance.text = object.text;
    return instance;
  }
}
