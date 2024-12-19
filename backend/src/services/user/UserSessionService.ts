import { v4 as uuidv4 } from "uuid";

import { UserSessionModel } from "@src/models/db/index.js";
import UserSessionRepository from "@src/repositories/user/UserSessionRepository.js";
import Service from "../Service.js";

export default class UserSessionService extends Service<
  UserSessionModel,
  UserSessionRepository
> {
  sessionRepo = new UserSessionRepository();

  constructor() {
    super(new UserSessionRepository());
  }

  getSessionByToken(token: string): Promise<UserSessionModel> {
    return this.sessionRepo.getByToken(token);
  }

  createSession(userId: number): Promise<UserSessionModel> {
    const session: UserSessionModel = new UserSessionModel();
    session.user_id = userId;
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.userExpireTime") * 1000,
    );
    session.token = uuidv4();
    return this.sessionRepo.create(session);
  }

  extendSession(session: UserSessionModel) {
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.userExpireTime") * 1000,
    );
    return this.sessionRepo.update(session);
  }

  reduceSession(session: UserSessionModel) {
    session.expire = new Date(new Date().getTime() - 1000);
    return this.sessionRepo.update(session);
  }
}
