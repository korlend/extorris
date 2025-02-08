import {
  createClient,
  type RedisClientOptions,
  type RedisClientType,
} from "redis";

import { RedisModels } from "extorris-common";
import { UserSessionModel } from "@src/models/db/index.js";
import PropagatedError from "@src/models/PropagatedError.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";

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

  private addUserSession(session: RedisModels.UserSession) {
    this.client.SET(
      this.formUserSessionKey(session.token),
      JSON.stringify(session),
    );
    return;
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

  public async writeUserSession(
    sessions: Array<UserSessionModel>,
  ): Promise<void>;
  public async writeUserSession(session: UserSessionModel): Promise<void>;
  public async writeUserSession(
    data: UserSessionModel | Array<UserSessionModel>,
  ): Promise<void>;
  public async writeUserSession(
    data: UserSessionModel | Array<UserSessionModel>,
  ) {
    if (data instanceof Array) {
      try {
        const redisUserSessions: Array<RedisModels.UserSession> = data.map(
          (v) => ({
            id: v.id,
            user_id: v.user_id,
            token: v.token,
            expire: v.expire,
          }),
        );
        const promises = [];
        for (let i = 0; i < redisUserSessions.length; i++) {
          const item = redisUserSessions[i];
          promises.push(this.addUserSession(item));
        }
        await Promise.all(promises);
        return;
      } catch (error: any) {
        throw new PropagatedError(
          ExpressResponseTypes.ERROR,
          error?.toString(),
        );
      }
    }
    try {
      const redisUserSession: RedisModels.UserSession = {
        id: data.id,
        user_id: data.user_id,
        token: data.token,
        expire: data.expire,
      };
      this.addUserSession(redisUserSession);
    } catch (error: any) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, error?.toString());
    }
  }

  public deleteUserSession(sessionToken: string) {
    return this.client.DEL(this.formUserSessionKey(sessionToken));
  }

  public async getUserSession(
    sessionToken: string,
  ): Promise<RedisModels.UserSession | null> {
    const data = await this.client.GET(this.formUserSessionKey(sessionToken));
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  // public async getAllUserSessions(): Promise<Array<RedisModels.UserSession>> {
  //   const data = await this.client.HGETALL(this.userSessionsKey);
  //   if (!data) {
  //     return [];
  //   }
  //   const keys = Object.keys(data);
  //   const sessions: Array<RedisModels.UserSession> = [];
  //   for (let i = 0; i < keys.length; i++) {
  //     const key = keys[i];
  //     const item = data[key];
  //     sessions.push(JSON.parse(item));
  //   }
  //   return sessions;
  // }

  public flushKeys() {
    return this.client.FLUSHALL();
  }
}
