import PasswordHelper from "@src/core/utils/PasswordHelper.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import {
  ShipModel,
  UserModel,
  UserSessionModel,
} from "@src/models/db/index.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import PropagatedError from "@src/models/PropagatedError.js";
import UserRepository from "@src/repositories/user/UserRepository.js";
import Service from "../Service.js";
import UserSessionService from "./UserSessionService.js";

export default class UserService extends Service<UserModel, UserRepository> {
  userRepo = new UserRepository();
  userSessionService = new UserSessionService();

  constructor() {
    super(new UserRepository());
  }

  async checkUserPassword(user: UserModel, password: string) {
    return (
      user.password === password ||
      (await PasswordHelper.checkPassword(password, user.password))
    );
  }

  async login(username: string, password: string): Promise<UserSessionModel> {
    let user = await this.userRepo.getByUsername(username);
    if (!user) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Wrong username or password",
      );
    }
    if (!(await this.checkUserPassword(user, password))) {
      this.userRepo.incrementPasswordAttempts(user);
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Wrong username or password",
      );
    }
    return await this.userSessionService.createSession(user.id);
  }

  async loginByEmail(
    email: string,
    password: string,
  ): Promise<UserSessionModel> {
    let user = await this.userRepo.getByEmail(email);
    if (!user) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Wrong email or password",
      );
    }
    if (!(await this.checkUserPassword(user, password))) {
      this.userRepo.incrementPasswordAttempts(user);
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Wrong email or password",
      );
    }
    return await this.userSessionService.createSession(user.id);
  }

  async logout(session: UserSessionModel) {
    return this.userSessionService.delete(session);
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.getUserByEmail(email);
  }

  async getEveryUserShipId() {
    return this.repo.getEveryUserShipId();
  }

  async register(user: UserModel): Promise<UserModel> {
    let newUser = null;
    if (!user.password) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "Password should be defined",
      );
    }
    const existingUser = await this.getUserByEmail(user.email);
    if (existingUser) {
      if (user.username === existingUser.username) {
        throw new PropagatedError(
          ExpressResponseTypes.ERROR,
          "Username already taken",
        );
      } else {
        throw new PropagatedError(
          ExpressResponseTypes.ERROR,
          "Email already exists",
        );
      }
    } else {
      const fields = new ParametersLimit<UserModel>();
      const userMap = user.getParamsAndValues();
      userMap.forEach((value, key) => {
        if (!value) {
          fields.exclude.push(key);
        }
      });
      user.password = await PasswordHelper.encryptPassword(user.password);
      newUser = await this.createUser(user, fields);
      // TODO: email verification
      // await senderHandler(newUser, 'newUser', frontendUrl)
    }
    return newUser;
  }

  async createDefaultShip(user: UserModel): Promise<ShipModel> {
    let ship = new ShipModel();
    return ship;
  }

  async getUser(id: number): Promise<UserModel> {
    return await this.userRepo.getUserWithoutPass(id);
  }

  async getUserBySessionToken(token: string): Promise<UserModel> {
    return await this.userRepo.getBySessionToken(token);
  }

  async getUsers(): Promise<Array<UserModel>> {
    return await this.userRepo.getAllUsersWithoutPass();
  }

  async createUser(
    user: UserModel,
    fields: ParametersLimit<UserModel>,
  ): Promise<UserModel> {
    return await this.userRepo.create(user, fields);
  }

  async updateUser(
    user: UserModel,
    checkPassword: boolean = true,
  ): Promise<UserModel> {
    if (checkPassword) {
      user.password = await PasswordHelper.encryptPassword(user.password);
    }
    return await this.userRepo.updateUser(user);
  }

  async getTotal(): Promise<number> {
    return await this.userRepo.getTotal();
  }
}
