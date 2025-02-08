
// USER_SENT_CHAT_MESSAGES
interface RabbitMQUserChatMessage {
  chatId: number;
  userId: number;
  message: string;
}

// CHAT_UPDATE_FOR_COMMS
interface RabbitMQChatUpdate {
  id: number;
  chatId: number;
  message: string;
  userId: number;
  updateUserIds?: Array<number>;
}

export { type RabbitMQUserChatMessage, type RabbitMQChatUpdate }
