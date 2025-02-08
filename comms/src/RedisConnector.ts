import {
  createClient,
  type RedisClientOptions,
  type RedisClientType,
} from "redis";

import { RedisModels } from "extorris-common";

export default class RedisConnector {
  private static instance: RedisConnector;

  private config?: RedisClientOptions;
  private client: RedisClientType;

  private userSessionsKey = RedisModels.DataKeys.USER_SESSIONS;

  private constructor(client: RedisClientType, config?: RedisClientOptions) {
    this.config = config;
    this.client = client;
    return this;
  }

  private formUserSessionKey(sessionToken: string) {
    return `${this.userSessionsKey}:${sessionToken}`;
  }

  public get getClient() {
    return this.client;
  }

  public disconnect() {
    this.client.disconnect();
  }

  public static async getInstance(
    config?: RedisClientOptions,
  ): Promise<RedisConnector> {
    if (RedisConnector.instance) {
      return RedisConnector.instance;
    }

    const client = await createClient(config)
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();

    // @ts-expect-error
    return (RedisConnector.instance = new RedisConnector(client, config));
  }

  public async getUserSession(
    sessionToken: string,
  ): Promise<RedisModels.UserSession | null> {
    const data = await this.client.GET(this.formUserSessionKey(sessionToken));
    if (!data) {
      return null
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }
}
