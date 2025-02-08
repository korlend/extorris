import { ChatMessageModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ChatMessageRepository extends Repository<ChatMessageModel> {
  constructor() {
    super(new ChatMessageModel());
  }
}
