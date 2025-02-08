import * as callbackApi from "amqplib/callback_api.js";

import { RabbitMQModels } from "extorris-common";

export default class RabbitMQConnector {
  private static instance: RabbitMQConnector;

  private channel: callbackApi.Channel;

  private constructor(channel: callbackApi.Channel) {
    this.channel = channel;
    return this;
  }

  private static async createConnection(
    url: string | callbackApi.Options.Connect,
  ): Promise<callbackApi.Connection> {
    return new Promise((resolve) => {
      callbackApi.connect(url, (error, connection) => {
        if (error) {
          console.error("rabbitmq failed to connect");
          throw error;
        }

        resolve(connection);
      });
    });
  }

  private static async createChannel(
    connection: callbackApi.Connection,
  ): Promise<callbackApi.Channel> {
    return new Promise((resolve) => {
      connection.createChannel(function (error, channel) {
        if (error) {
          throw error;
        }

        resolve(channel);
      });
    });
  }

  public static async getInstance(
    url: string | callbackApi.Options.Connect,
  ): Promise<RabbitMQConnector> {
    if (RabbitMQConnector.instance) {
      return RabbitMQConnector.instance;
    }

    const connection = await RabbitMQConnector.createConnection(url);
    const channel = await RabbitMQConnector.createChannel(connection);

    const queueKeys = [
      RabbitMQModels.RabbitMQKeys.USER_SENT_CHAT_MESSAGES,
      RabbitMQModels.RabbitMQKeys.CHAT_UPDATE_FOR_COMMS,
    ];

    for (let i = 0; i < queueKeys.length; i++) {
      channel.assertQueue(queueKeys[i], {
        durable: false,
      });
    }

    return (RabbitMQConnector.instance = new RabbitMQConnector(channel));
  }

  enqueueUserChatMessage(message: RabbitMQModels.RabbitMQUserChatMessage) {
    this.channel.sendToQueue(
      RabbitMQModels.RabbitMQKeys.USER_SENT_CHAT_MESSAGES,
      Buffer.from(JSON.stringify(message)),
    );
  }

  setChatDequeueCallback(
    callback: (message: RabbitMQModels.RabbitMQChatUpdate) => void,
  ) {
    this.channel.consume(
      RabbitMQModels.RabbitMQKeys.CHAT_UPDATE_FOR_COMMS,
      (msg: callbackApi.Message | null) => {
        if (!msg) {
          return;
        }
        const parsedMessage = JSON.parse(msg.content.toString());
        callback(parsedMessage);
      },
      {
        noAck: true,
      },
    );
  }
}
