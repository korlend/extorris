import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";
import { ChatTypes } from "extorris-common";

export default class ChatModel extends DBModel<ChatModel> {
  _tableName: string = "chats";
  _entityType: EntityType = EntityType.CHAT;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.GUILD })
  guild_id?: number;

  @FieldType(FieldTypes.STRING)
  name?: string;

  @FieldType(FieldTypes.STRING_SELECT, { stringList: Object.values(ChatTypes) })
  type?: ChatTypes;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created?: Date;

  parseObject(object: DBModelOnlyDBData<ChatModel>): ChatModel {
    const instance = new ChatModel();
    instance.id = object.id;
    instance.guild_id = object.guild_id;
    instance.name = object.name;
    instance.type = object.type;
    instance.created = object.created ? new Date(object.created) : undefined;
    return instance;
  }
}
