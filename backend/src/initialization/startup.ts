import AdminModel from "@src/models/db/AdminModel.js";
import AdminService from "@src/services/AdminService.js";

async function dbDataInit(config: any) {
  const adminService = new AdminService();
  const admins = await adminService.getAll();
  if (!admins?.length) {
    const defaultAdmins = config.get("auth.security.defaultAdmins");
    for (let i = 0; i < defaultAdmins.length; i++) {
      const admin = new AdminModel().parseObject(defaultAdmins[i]);
      adminService.create(admin);
    }
  }
}

export { dbDataInit };
