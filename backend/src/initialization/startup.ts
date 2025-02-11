import RedisConnector from "@src/core/RedisConnector.js";
import AdminRoleService from "@src/services/admin/AdminRoleService.js";
import AdminService from "@src/services/admin/AdminService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";
import getAdminRoles from "defaults/models/getAdminRoles.js";
import getAdmins from "defaults/models/getAdmins.js";

async function dbDataInit(config: any) {
  const promises = [];

  // roles and admins
  promises.push(
    new Promise(async (resolve) => {
      const adminRolesService = new AdminRoleService();
      const adminService = new AdminService();

      // default roles
      const adminRoles = await getAdminRoles();
      const loadedAdminRoles = [];
      for (let i = 0; i < adminRoles.length; i++) {
        const data = adminRoles[i];
        const existingData = await adminRolesService.getBy("name", data.name);
        if (existingData) {
          loadedAdminRoles.push(existingData);
          continue;
        }
        loadedAdminRoles.push(await adminRolesService.create(data));
      }

      // default admins
      const admins = await getAdmins(loadedAdminRoles);
      for (let i = 0; i < admins.length; i++) {
        const data = admins[i];
        const existingData = await adminService.getBy(
          "username",
          data.username,
        );
        if (existingData) {
          continue;
        }
        await adminService.create(data);
      }
      resolve(true);
    }),
  );

  /*
  // default ship parts
  promises.push(
    new Promise(async (resolve) => {
      const shipPartTypeService = new ShipPartTypeService();
      const shipPartSubtypeService = new ShipPartSubtypeService();

      // default ship part subtypes
      const shipPartSubtypes = await getShipPartSubtypes();
      const loadedShipPartSubtypes = [];
      for (let i = 0; i < shipPartSubtypes.length; i++) {
        const data = shipPartSubtypes[i];
        const existingData = await shipPartSubtypeService.getBy("code_name", data.code_name);
        if (existingData) {
          loadedShipPartSubtypes.push(existingData);
          continue;
        }
        loadedShipPartSubtypes.push(await shipPartSubtypeService.create(data));
      }

      // default ship parts
      const shipPartTypes = await getShipPartTypes(loadedShipPartSubtypes);
      for (let i = 0; i < shipPartTypes.length; i++) {
        const data = shipPartTypes[i];
        const existingData = await shipPartTypeService.getBy(
          "code_name",
          data.code_name,
        );
        if (existingData) {
          data.id = existingData.id;
          await shipPartTypeService.update(data);
          continue;
        }
        await shipPartTypeService.create(data);
      }
      resolve(true);
    }),
  );
  */

  await Promise.all(promises);
}

async function redisDataInit() {
  const promises = [];

  const redisConnector = await RedisConnector.getInstance();

  if (!redisConnector) {
    return;
  }

  const sessionService = new UserSessionService();
  const sessions = await sessionService.getActiveSessions();
  promises.push(redisConnector.writeUserSession(sessions));

  await Promise.all(promises);
}

export { dbDataInit, redisDataInit };
