import { UserSessionModel } from "@src/models/db/index.js";
import UserSessionRepository from "@src/repositories/user/UserSessionRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import RedisConnector from "@src/core/RedisConnector.js";
import ServiceOperations from "@src/enums/ServiceOperations.js";

export default class UserSessionService extends Service<
  UserSessionModel,
  UserSessionRepository
> {
  sessionRepo = new UserSessionRepository();

  // setting callbacks to created/update/delete data in redis
  preOperationCallbacks = {
    [ServiceOperations.CREATE]: async (
      data: UserSessionModel | Array<UserSessionModel>,
    ) => {
      const redisConnector = await RedisConnector.getInstance();
      redisConnector.writeUserSession(data);
    },
    [ServiceOperations.UPDATE]: async (
      data: UserSessionModel | Array<UserSessionModel>,
    ) => {
      const redisConnector = await RedisConnector.getInstance();
      redisConnector.writeUserSession(data);
    },
    [ServiceOperations.DELETE]: async (data: number | Array<number>) => {
      const redisConnector = await RedisConnector.getInstance();
      if (data instanceof Array) {
        const loadedData = await this.getAllByIds(data);
        for (let i = 0; i < loadedData.length; i++) {
          const item = loadedData[i];
          await redisConnector.deleteUserSession(item.token);
        }
      } else {
        const loadedItem = await this.get(data);
        if (!loadedItem) return;
        await redisConnector.deleteUserSession(loadedItem.token);
      }
    },
  };

  constructor() {
    super(new UserSessionRepository());
  }

  getSessionByToken(token: string): Promise<UserSessionModel> {
    return this.sessionRepo.getByToken(token);
  }

  async createSession(userId: number): Promise<UserSessionModel> {
    const userActiveSessions = await this.getUserInactiveSessions(userId);
    await this.deleteAll(userActiveSessions);

    const session: UserSessionModel = new UserSessionModel();
    session.user_id = userId;
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.userExpireTime") * 1000,
    );
    session.token = crypto.randomUUID();
    const newSession = await this.sessionRepo.create(session);
    const redisConnector = await RedisConnector.getInstance();
    redisConnector.writeUserSession(newSession);
    return newSession;
  }

  async extendSession(session: UserSessionModel) {
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.userExpireTime") * 1000,
    );
    const newSession = await this.sessionRepo.update(session);
    const redisConnector = await RedisConnector.getInstance();
    redisConnector.writeUserSession(newSession);
    return newSession;
  }

  async reduceSession(session: UserSessionModel) {
    session.expire = new Date(new Date().getTime() - 1000);
    const newSession = await this.sessionRepo.update(session);
    const redisConnector = await RedisConnector.getInstance();
    redisConnector.writeUserSession(newSession);
    return newSession;
  }

  async getActiveSessions() {
    const filters: Array<DBFilter<UserSessionModel>> = [];
    filters.push(new DBFilter("expire", new Date(), ">"));
    const data = await this.getSearchAll(
      new SearchRequestData(0, 10000),
      undefined,
      filters,
    );
    return data.items;
  }

  async getUserInactiveSessions(userId: number) {
    const filters: Array<DBFilter<UserSessionModel>> = [];
    filters.push(new DBFilter("user_id", userId));
    filters.push(new DBFilter("expire", new Date(), "<"));
    const data = await this.getSearchAll(
      new SearchRequestData(0, 10000),
      undefined,
      filters,
    );
    return data.items;
  }
}
