import PasswordHelper from "@src/core/utils/PasswordHelper.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import {
  ShipArmorModel,
  ShipCannonModel,
  ShipEnergyCoreModel,
  ShipEngineModel,
  ShipHullModel,
  ShipModel,
  UserIslandModel,
  UserModel,
  UserSessionModel,
} from "@src/models/db/index.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import PropagatedError from "@src/models/PropagatedError.js";
import UserRepository from "@src/repositories/user/UserRepository.js";
import Service from "../Service.js";
import UserSessionService from "./UserSessionService.js";
import {
  generateDefaultArmors,
  generateDefaultCannons,
  generateDefaultEnergyCores,
  generateDefaultEngines,
  generateDefaultHulls,
} from "defaults/models/user/index.js";
import ShipArmorService from "../ship/ShipArmorService.js";
import ShipCannonService from "../ship/ShipCannonService.js";
import ShipEnergyCoreService from "../ship/ShipEnergyCoreService.js";
import ShipEngineService from "../ship/ShipEngineService.js";
import ShipHullService from "../ship/ShipHullService.js";
import ShipService from "../ship/ShipService.js";
import UserIslandService from "../UserIslandService.js";
import DBFilter from "@src/models/DBFilter.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import MainMapHubService from "../main_map/MainMapHubService.js";

export default class UserService extends Service<UserModel, UserRepository> {
  userRepo = new UserRepository();
  userSessionService = new UserSessionService();

  constructor() {
    super(new UserRepository());
  }

  async createUpdateUserDefaultShipParts(user: UserModel): Promise<void> {
    const modelArmors = await generateDefaultArmors(user.id);
    const modelCannons = await generateDefaultCannons(user.id);
    const modelEnergyCores = await generateDefaultEnergyCores(user.id);
    const modelEngines = await generateDefaultEngines(user.id);
    const modelHulls = await generateDefaultHulls(user.id);

    const shipArmorService = new ShipArmorService();
    const shipCannonService = new ShipCannonService();
    const shipEnergyCoreService = new ShipEnergyCoreService();
    const shipEngineService = new ShipEngineService();
    const shipHullService = new ShipHullService();

    const getByFilters: Array<
      DBModelDBDataKeys<ShipArmorModel> &
        DBModelDBDataKeys<ShipCannonModel> &
        DBModelDBDataKeys<ShipEnergyCoreModel> &
        DBModelDBDataKeys<ShipEngineModel> &
        DBModelDBDataKeys<ShipHullModel>
    > = ["user_id", "code_name"];

    // limiting update of ship_id otherwise we unequip all ship items

    await shipArmorService.createUpdateAll(
      modelArmors,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipCannonService.createUpdateAll(
      modelCannons,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipEnergyCoreService.createUpdateAll(
      modelEnergyCores,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipEngineService.createUpdateAll(
      modelEngines,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
    await shipHullService.createUpdateAll(
      modelHulls,
      getByFilters,
      new ParametersLimit(["ship_id"]),
    );
  }

  async createDefaultUserShip(user: UserModel): Promise<void> {
    const shipService = new ShipService();

    const userShip = await shipService.getBy("user_id", user.id);

    if (!userShip) {
      const newUserShip = new ShipModel();
      newUserShip.user_id = user.id;
      newUserShip.is_parked = true;
      await shipService.create(newUserShip);
    }
  }

  async createDefaultUserIsland(user: UserModel): Promise<void> {
    const userIslandService = new UserIslandService();
    const mainMapHubService = new MainMapHubService();

    const userIsland = await userIslandService.getBy("user_id", user.id);

    if (!userIsland) {
      const randomHub = await mainMapHubService.getRandomUserIslandSpawnPoint();

      const newUserIsland = new UserIslandModel();
      newUserIsland.user_id = user.id;
      newUserIsland.main_map_hub_id = randomHub.id;
      await userIslandService.create(newUserIsland);
    }
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
    return this.userSessionService.reduceSession(session);
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.getUserByEmail(email);
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
