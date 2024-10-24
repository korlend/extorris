import AdminSessionModel from "@src/models/db/AdminSessionModel.js";
import Repository from "./Repository.js";

export default class AdminSessionRepository extends Repository<AdminSessionModel> {
  constructor() {
    super(new AdminSessionModel(), "admin_sessions");
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