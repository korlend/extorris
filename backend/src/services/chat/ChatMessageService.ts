import { ChatMessageModel } from "@src/models/db/index.js";
import ChatMessageRepository from "@src/repositories/chat/ChatMessageRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";

export default class ChatMessageService extends Service<
  ChatMessageModel,
  ChatMessageRepository
> {
  constructor() {
    super(new ChatMessageRepository());
  }

  async loadChatsInitialMessages(
    chatIds: Array<number>,
    limit = 10,
  ): Promise<Array<ChatMessageModel>> {
    const messages: Array<ChatMessageModel> = [];

    for (let i = 0; i < chatIds.length; i++) {
      const chatId = chatIds[i];
      const filters: Array<DBFilter<ChatMessageModel>> = [];
      filters.push(new DBFilter("chat_id", chatId));
      const chatMessages = await this.getSearchAll(
        new SearchRequestData(0, limit, "id", "desc"),
        undefined,
        filters,
      );
      if (chatMessages?.items?.length) {
        chatMessages.items.forEach((msg) => messages.push(msg));
      }
    }

    return messages;
  }
}
