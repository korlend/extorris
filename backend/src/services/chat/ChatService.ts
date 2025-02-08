import {
  ChatMessageModel,
  ChatModel,
  UserModel,
} from "@src/models/db/index.js";
import ChatRepository from "@src/repositories/chat/ChatRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import { ChatTypes } from "extorris-common";
import SearchRequestData from "@src/models/SearchRequestData.js";
import ChatUserService from "./ChatUserService.js";
import ChatMessageService from "./ChatMessageService.js";
import RabbitMQConnector from "@src/core/RabbitMQConnector.js";

export default class ChatService extends Service<ChatModel, ChatRepository> {
  constructor() {
    super(new ChatRepository());
  }

  async getUserChats(user: UserModel): Promise<Array<ChatModel>> {
    const chatUserService = new ChatUserService();

    await this.createGlobalChat();

    const chatFilters: Array<DBFilter<ChatModel>> = [];
    chatFilters.push(new DBFilter("type", ChatTypes.ALL_CHAT, "=", "OR"));
    if (user.guild_id) {
      chatFilters.push(
        new DBFilter("type", ChatTypes.GUILD_CHAT, "=", "AND", "OPEN"),
      );
      chatFilters.push(
        new DBFilter("guild_id", user.guild_id, "=", "OR", "CLOSE"),
      );
    }

    const linkedChats = await chatUserService.getAllBy("user_id", user.id);
    for (let i = 0; i < linkedChats.length; i++) {
      const linkedChat = linkedChats[i];
      if (!linkedChat.chat_id) {
        continue;
      }
      chatFilters.push(new DBFilter("id", linkedChat.chat_id, "=", "OR"));
    }

    const chatsSearch = await this.getSearchAll(
      new SearchRequestData(0, 100),
      undefined,
      chatFilters,
    );
    const chats = chatsSearch.items;

    return chats;
  }

  async isGlobalChatExists(): Promise<boolean> {
    const globalChats = await this.getAllBy("type", ChatTypes.ALL_CHAT);
    return !!globalChats.length;
  }

  async createGlobalChat(): Promise<void> {
    const doesGlobalExist = await this.isGlobalChatExists();
    if (doesGlobalExist) {
      return;
    }

    const globalChat = new ChatModel();
    globalChat.name = "global_chat";
    globalChat.type = ChatTypes.ALL_CHAT;

    await this.create(globalChat);
  }

  async userSentMessage(message: string, chatId: number, userId: number) {
    const chatMessageService = new ChatMessageService();
    const newMessage = new ChatMessageModel();
    newMessage.chat_id = chatId;
    newMessage.message = message;
    newMessage.user_id = userId;
    const chat = await this.get(chatId);
    if (chat.type === ChatTypes.ALL_CHAT) {
      const createdMessage = await chatMessageService.create(newMessage);
      this.sendChatUpdate(createdMessage);
    }

    // guild_chat | custom_chat
    // check if user has right to post message here
  }

  async sendChatUpdate(
    chatMessage: ChatMessageModel,
    updateUserIds?: Array<number>,
  ) {
    if (!chatMessage.chat_id || !chatMessage.message || !chatMessage.user_id) {
      return;
    }
    const rabbitmq = await RabbitMQConnector.getInstance(
      "amqp://localhost:5672",
    );
    rabbitmq.enqueueChatMessage({
      id: chatMessage.id,
      chatId: chatMessage.chat_id,
      message: chatMessage.message,
      userId: chatMessage.user_id,
      updateUserIds,
    });
  }
}
