import { ChatUserModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class ChatUserRepository extends Repository<ChatUserModel> {
  constructor() {
    super(new ChatUserModel());
  }
}
