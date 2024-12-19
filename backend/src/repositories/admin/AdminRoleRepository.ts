import { AdminRoleModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class AdminRoleRepository extends Repository<AdminRoleModel> {
  constructor() {
    super(new AdminRoleModel());
  }
}
