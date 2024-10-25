import AdminRoleModel from "@src/models/db/AdminRoleModel.js";
import AdminRoleRepository from "@src/repositories/AdminRoleRepository.js";
import Service from "./Service.js";

export default class AdminRoleService extends Service<
  AdminRoleModel,
  AdminRoleRepository
> {
  sessionRepo = new AdminRoleRepository();

  constructor() {
    super(new AdminRoleRepository());
  }
}
