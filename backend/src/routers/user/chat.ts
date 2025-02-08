import express, { Request, Response, NextFunction } from "express";
import ExpressResponseGenerator from "@src/core/router/ExpressResponseGenerator.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ChatService from "@src/services/chat/ChatService.js";
import ChatMessageService from "@src/services/chat/ChatMessageService.js";

const router = express.Router();

router.get("/load", async (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  const chatService = new ChatService();
  const chatMessageService = new ChatMessageService();

  if (!user) {
    next(ExpressResponseGenerator.getResponse(ExpressResponseTypes.FORBIDDEN));
    return;
  }

  const availableChats = await chatService.getUserChats(user);
  const initialMessages = await chatMessageService.loadChatsInitialMessages(
    availableChats.map((chat) => chat.id),
  );

  next(
    ExpressResponseGenerator.getResponse(ExpressResponseTypes.SUCCESS, {
      chats: availableChats.map((chat) => chat.prepareREST()),
      messages: initialMessages.map((msg) => msg.prepareREST()),
    }),
  );
});

export default router;
