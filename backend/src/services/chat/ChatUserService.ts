import { ChatUserModel } from "@src/models/db/index.js";
import ChatUserRepository from "@src/repositories/chat/ChatUserRepository.js";
import Service from "../Service.js";

export default class ChatUserService extends Service<
  ChatUserModel,
  ChatUserRepository
> {
  constructor() {
    super(new ChatUserRepository());
  }
}
