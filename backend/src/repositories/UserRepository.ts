import UserModel from "@src/models/db/UserModel.js";
import Repository from "./Repository.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import UserSessionRepository from "./UserSessionRepository.js";

export default class UserRepository extends Repository<UserModel> {
  userModel = new UserModel();
  userSessionRepo = new UserSessionRepository();

  constructor() {
    super(new UserModel(), "users");
  }

  getUserPassword(id: number): Promise<string> {
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
        this.modelFromDataPacket(resp).then((userModel) => userModel.password),
      );
  }

  getByEmail(email: string): Promise<UserModel> {
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

  getByUsername(username: string): Promise<UserModel> {
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

  getUserByEmail(email: string) {
    return this.getBy("email", email, new ParametersLimit(["password"]));
  }

  getByFirstname(firstname: string): Promise<UserModel> {
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

  getBySessionToken(token: string): Promise<UserModel> {
    return this.connector
      .query(
        `
      select u.* from ${this.target} u
      left join ${this.userSessionRepo.target} s on u.id = s.user_id
      where s.token = ?
      ${this.defaultFilters("u")}
    `,
        [token],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  incrementPasswordAttempts(user: UserModel) {
    this.connector.query(
      `
      UPDATE ${this.target}
      SET login_attempts = login_attempts + 1
      WHERE id = ?
    `,
      [user.id],
    );
  }

  updateUser(user: UserModel) {
    return this.update(user, new ParametersLimit([], [], ["password"]));
  }

  getUserWithoutPass(id: number) {
    return this.get(id, new ParametersLimit(["password"]));
  }

  getAllUsersWithoutPass() {
    return this.getAll(0, 0, new ParametersLimit(["password"]));
  }

  // removeSessions(userId: number) {
  //   this.connector.query(`
  //     DELETE FROM ${this.userSessionRepo.target}
  //     WHERE user_id = ?
  //   `, [userId])
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

  getUsersByMallId(
    from: number = 0,
    pageSize: number = 10,
    mallId: number,
    parametersLimit: ParametersLimit = new ParametersLimit(),
  ): Promise<UserModel> {
    return this.connector
      .query(
        `
      select ${this.userModel.parametersKeysSnake(parametersLimit).join(",")} from ${this.target}
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

  getAllNotApprovedUsersAndAdmin(
    fieldsExclude: ParametersLimit = new ParametersLimit(),
  ): Promise<UserModel> {
    return this.connector
      .query(
        `
      select ${this.userModel.parametersKeysSnake(fieldsExclude).join(",")} from ${this.target}
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
