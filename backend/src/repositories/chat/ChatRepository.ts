import { ChatModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ChatRepository extends Repository<ChatModel> {
  constructor() {
    super(new ChatModel());
  }
}
