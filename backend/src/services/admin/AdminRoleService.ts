import { AdminRoleModel } from "@src/models/db/index.js";
import AdminRoleRepository from "@src/repositories/admin/AdminRoleRepository.js";
import Service from "../Service.js";

export default class AdminRoleService extends Service<
  AdminRoleModel,
  AdminRoleRepository
> {
  constructor() {
    super(new AdminRoleRepository());
  }
}
