import { AdminModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import AdminSessionRepository from "./AdminSessionRepository.js";

export default class AdminRepository extends Repository<AdminModel> {
  adminModel = new AdminModel();
  adminSessionRepo = new AdminSessionRepository();

  constructor() {
    super(new AdminModel());
  }

  getAdminPassword(id: number): Promise<string> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id = ?
      ${this.defaultFilters()}
    `,
        [id],
      )
      .then((resp) =>
        this.modelFromDataPacket(resp).then((adminModel) => adminModel.password),
      );
  }

  getByEmail(email: string): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where email = ?
      ${this.defaultFilters()}
    `,
        [email],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getByUsername(username: string): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where username = ?
      ${this.defaultFilters()}
    `,
        [username],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getAdminByEmail(email: string) {
    return this.getBy("email", email, new ParametersLimit(["password"]));
  }

  getByFirstname(firstname: string): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where firstname = ?
      ${this.defaultFilters()}
    `,
        [firstname],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getBySessionToken(token: string): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select u.* from ${this.target} u
      left join ${this.adminSessionRepo.target} s on u.id = s.admin_id
      where s.token = ?
      ${this.defaultFilters("u")}
    `,
        [token],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  incrementPasswordAttempts(admin: AdminModel) {
    this.connector.query(
      `
      UPDATE ${this.target}
      SET login_attempts = login_attempts + 1
      WHERE id = ?
    `,
      [admin.id],
    );
  }

  updateAdmin(admin: AdminModel) {
    return this.update(admin, new ParametersLimit([], [], ["password"]));
  }

  getAdminWithoutPass(id: number) {
    return this.get(id, new ParametersLimit(["password"]));
  }

  getAllAdminsWithoutPass() {
    return this.getAll(0, 0, new ParametersLimit(["password"]));
  }

  // removeSessions(adminId: number) {
  //   this.connector.query(`
  //     DELETE FROM ${this.adminSessionRepo.target}
  //     WHERE admin_id = ?
  //   `, [adminId])
  // }

  getTotal(): Promise<number> {
    return this.connector
      .query(
        `
      select count(*) from ${this.target}
    `,
      )
      .then((resp) => {
        if (resp && resp.length) {
          resp = resp[0];
          return resp["count(*)"];
        }
        return 0;
      });
  }

  getAdminsByMallId(
    from: number = 0,
    pageSize: number = 10,
    mallId: number,
    parametersLimit: ParametersLimit<AdminModel> = new ParametersLimit(),
  ): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select ${this.adminModel.parametersKeys(parametersLimit).join(",")} from ${this.target}
      where id is not null
      ${this.defaultFilters()}
      ${mallId ? `and mall_id = ${mallId}` : ""}
      ${pageSize ? `limit ${from},${pageSize}` : ""}
    `,
      )
      .then((resp) => {
        if (resp && resp.length) {
          return resp;
        }
        return [];
      });
  }

  getAllNotApprovedAdminsAndAdmin(
    fieldsExclude: ParametersLimit<AdminModel> = new ParametersLimit(),
  ): Promise<AdminModel> {
    return this.connector
      .query(
        `
      select ${this.adminModel.parametersKeys(fieldsExclude).join(",")} from ${this.target}
      where id is not null
      ${this.defaultFilters()}
      and approved = 0
      or email = 'admin@admin.admin'
    `,
      )
      .then((resp) => {
        if (resp && resp.length) {
          return resp;
        }
        return [];
      });
  }
}
