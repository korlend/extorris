import { UserSessionModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class UserSessionRepository extends Repository<UserSessionModel> {
  constructor() {
    super(new UserSessionModel());
  }

  getByToken(token: string): Promise<any> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where token = ?
    `,
        [token],
      )
      .then((resp: any) => this.modelFromDataPacket(resp));
  }
}
