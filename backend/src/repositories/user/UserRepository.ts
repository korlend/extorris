import { UserModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import UserSessionRepository from "./UserSessionRepository.js";
import ShipRepository from "../ship/ShipRepository.js";

export default class UserRepository extends Repository<UserModel> {
  userModel = new UserModel();
  userSessionRepo = new UserSessionRepository();

  constructor() {
    super(new UserModel());
  }

  getEveryUserShipId(): Promise<
    Array<{
      user_id: number;
      ship_id: number;
    }>
  > {
    const shipRepository = new ShipRepository();
    return this.connector.query(
      `
      select u.id as user_id, s.id as ship_id from ${this.target} u
      left join ${shipRepository.target} s on u.id = s.user_id
      limit 10000
    `,
    );
  }

  getUserPassword(id: number): Promise<string> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id = ?
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
    `,
        [username],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getUserByEmail(email: string) {
    return this.getBy("email", email, new ParametersLimit([], ["password"]));
  }

  getByFirstname(firstname: string): Promise<UserModel> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where firstname = ?
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
    return this.get(id, new ParametersLimit([], ["password"]));
  }

  getAllUsersWithoutPass() {
    return this.getAll(0, 0, new ParametersLimit([], ["password"]));
  }

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

  getAllNotApprovedUsersAndAdmin(
    fieldsExclude: ParametersLimit<UserModel> = new ParametersLimit(),
  ): Promise<UserModel> {
    return this.connector
      .query(
        `
      select ${this.userModel.parametersKeys(fieldsExclude).join(",")} from ${this.target}
      where approved = 0
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
