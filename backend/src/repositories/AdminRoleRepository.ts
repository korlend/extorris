import AdminRoleModel from "@src/models/db/AdminRoleModel.js";
import Repository from "./Repository.js";

export default class AdminRoleRepository extends Repository<AdminRoleModel> {
  constructor() {
    super(new AdminRoleModel(), "admin_roles");
  }
}
