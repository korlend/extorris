import { AdminSessionModel } from "@src/models/db/index.js";
import AdminSessionRepository from "@src/repositories/admin/AdminSessionRepository.js";
import Service from "../Service.js";

export default class AdminSessionService extends Service<
  AdminSessionModel,
  AdminSessionRepository
> {
  sessionRepo = new AdminSessionRepository();

  constructor() {
    super(new AdminSessionRepository());
  }

  getSessionByToken(token: string): Promise<AdminSessionModel> {
    return this.sessionRepo.getByToken(token);
  }

  createSession(adminId: number): Promise<AdminSessionModel> {
    const session: AdminSessionModel = new AdminSessionModel();
    session.admin_id = adminId;
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.adminExpireTime") * 1000,
    );
    session.token = crypto.randomUUID();
    return this.sessionRepo.create(session);
  }

  extendSession(session: AdminSessionModel) {
    session.expire = new Date(
      new Date().getTime() +
        this.sessionRepo.config?.get("auth.session.adminExpireTime") * 1000,
    );
    return this.sessionRepo.update(session);
  }

  reduceSession(session: AdminSessionModel) {
    session.expire = new Date(new Date().getTime() - 1000);
    return this.sessionRepo.update(session);
  }
}
