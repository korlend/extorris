import PasswordHelper from "@src/core/utils/PasswordHelper.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import PropagatedError from "@src/models/PropagatedError.js";
import AdminSessionService from "./AdminSessionService.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { AdminModel, AdminSessionModel } from "@src/models/db/index.js";
import AdminRepository from "@src/repositories/admin/AdminRepository.js";
import Service from "../Service.js";

export default class AdminService extends Service<AdminModel, AdminRepository> {
  adminRepo = new AdminRepository();
  adminSessionService = new AdminSessionService();

  constructor() {
    super(new AdminRepository());
  }

  async checkAdminPassword(admin: AdminModel, password: string) {
    return (
      admin.password === password ||
      (await PasswordHelper.checkPassword(password, admin.password))
    );
  }

  async login(username: string, password: string): Promise<AdminSessionModel> {
    let admin = await this.adminRepo.getByUsername(username);
    if (!admin) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "Wrong username or password");
    }
    if (!(await this.checkAdminPassword(admin, password))) {
      this.adminRepo.incrementPasswordAttempts(admin);
      throw new PropagatedError(ExpressResponseTypes.ERROR, "Wrong username or password");
    }
    return await this.adminSessionService.createSession(admin.id);
  }

  async loginByEmail(email: string, password: string): Promise<AdminSessionModel> {
    let admin = await this.adminRepo.getByEmail(email);
    if (!admin) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "Wrong email or password");
    }
    if (!(await this.checkAdminPassword(admin, password))) {
      this.adminRepo.incrementPasswordAttempts(admin);
      throw new PropagatedError(ExpressResponseTypes.ERROR, "Wrong email or password");
    }
    return await this.adminSessionService.createSession(admin.id);
  }

  async logout(session: AdminSessionModel) {
    return this.adminSessionService.reduceSession(session);
  }

  async getAdminByEmail(email: string) {
    return await this.adminRepo.getAdminByEmail(email);
  }

  async register(admin: AdminModel) {
    let existsMsg = "";
    let newAdmin = null;
    if (!admin.password) {
      throw new PropagatedError(ExpressResponseTypes.ERROR, "Password should be defined");
    }
    const existingAdmin = await this.getAdminByEmail(admin.email);
    if (existingAdmin) {
      if (admin.username === existingAdmin.username) {
        existsMsg = "username already taken";
      } else {
        existsMsg = "email already exists";
      }
    } else {
      const fields = new ParametersLimit<AdminModel>();
      const adminMap = admin.getParamsAndValues();
      adminMap.forEach((value, key) => {
        if (!value) {
          fields.exclude.push(key);
        }
      });
      admin.password = await PasswordHelper.encryptPassword(admin.password);
      newAdmin = await this.createAdmin(admin, fields);
      // TODO: email verification
      // await senderHandler(newAdmin, 'newAdmin', frontendUrl)
    }
    return { newAdmin, existsMsg };
  }

  async getAdmin(id: number): Promise<AdminModel> {
    return await this.adminRepo.getAdminWithoutPass(id);
  }

  async getAdminBySessionToken(token: string): Promise<AdminModel> {
    return await this.adminRepo.getBySessionToken(token);
  }

  async getAdmins(): Promise<Array<AdminModel>> {
    return await this.adminRepo.getAllAdminsWithoutPass();
  }

  async createAdmin(
    admin: AdminModel,
    fields = new ParametersLimit<AdminModel>(),
  ): Promise<AdminModel> {
    return await this.adminRepo.create(admin, fields);
  }

  async updateAdmin(
    admin: AdminModel,
    checkPassword: boolean = true,
  ): Promise<AdminModel> {
    if (checkPassword) {
      admin.password = await PasswordHelper.encryptPassword(admin.password);
    }
    return await this.adminRepo.updateAdmin(admin);
  }

  async getTotal(): Promise<number> {
    return await this.adminRepo.getTotal();
  }
}
