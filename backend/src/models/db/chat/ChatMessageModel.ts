import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ChatMessageModel extends DBModel<ChatMessageModel> {
  _tableName: string = "chat_messages";
  _entityType: EntityType = EntityType.CHAT_MESSAGE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.CHAT })
  chat_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  @FieldType(FieldTypes.STRING)
  message?: string;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created?: Date;

  parseObject(object: DBModelOnlyDBData<ChatMessageModel>): ChatMessageModel {
    const instance = new ChatMessageModel();
    instance.id = object.id;
    instance.user_id = object.user_id;
    instance.chat_id = object.chat_id;
    instance.message = object.message;
    instance.created = object.created ? new Date(object.created) : undefined;
    return instance;
  }
}
