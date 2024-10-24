import UserSessionModel from "@src/models/db/UserSessionModel.js";
import Repository from "./Repository.js";

export default class UserSessionRepository extends Repository<UserSessionModel> {
  constructor() {
    super(new UserSessionModel(), "user_sessions");
  }

  getByToken(token: string): Promise<any> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where token = ?
      ${this.defaultFilters()}
    `,
        [token],
      )
      .then((resp: any) => this.modelFromDataPacket(resp));
  }
}
