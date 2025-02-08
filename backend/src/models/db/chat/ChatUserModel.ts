import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ChatUserModel extends DBModel<ChatUserModel> {
  _tableName: string = "chat_users";
  _entityType: EntityType = EntityType.CHAT_USERS;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.CHAT })
  chat_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.USER })
  user_id?: number;

  parseObject(object: DBModelOnlyDBData<ChatUserModel>): ChatUserModel {
    const instance = new ChatUserModel();
    instance.id = object.id;
    instance.chat_id = object.chat_id;
    instance.user_id = object.user_id;
    return instance;
  }
}
