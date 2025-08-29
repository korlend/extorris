import RedisConnector from "@src/core/RedisConnector.js";
import { MainMapHubModel } from "@src/models/db/index.js";
import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import AdminRoleService from "@src/services/admin/AdminRoleService.js";
import AdminService from "@src/services/admin/AdminService.js";
import ConfigDimensionsService from "@src/services/ConfigDimensionsService.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import PortalService from "@src/services/main_map/PortalService.js";
import ShipService from "@src/services/ship/ShipService.js";
import UserService from "@src/services/user/UserService.js";
import UserSessionService from "@src/services/user/UserSessionService.js";
import UserIslandService from "@src/services/UserIslandService.js";
import getAdminRoles from "defaults/models/getAdminRoles.js";
import getAdmins from "defaults/models/getAdmins.js";
import getConfigDimensions from "defaults/models/getConfigDimensions.js";

import cronJobs from "@src/cronJobs/index.js";
import RTCalcInstanceHubService from "@src/services/rtcalc/RTCalcInstanceHubService.js";
import RTCalcInstanceService from "@src/services/rtcalc/RTCalcInstanceService.js";
import { RTCalcInstructionsTypes } from "extorris-common";

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
    // writing objects width/height config to db
    new Promise(async (resolve) => {
      const configDimensionsService = new ConfigDimensionsService();

      const configDimensions = await getConfigDimensions();
      await configDimensionsService.createUpdateAll(configDimensions, ["name"]);
      resolve(true);
    }),
    // reinit of rtcalc services
    new Promise(async (resolve) => {
      const rtcalcInstanceHubService = new RTCalcInstanceHubService();
      const rtcalcInstanceService = new RTCalcInstanceService();
      const instances = await rtcalcInstanceService.getAll(0, 100000);
      await rtcalcInstanceHubService.deleteAll(
        await rtcalcInstanceHubService.getAll(
          0,
          100000,
          new ParametersLimit(["id"]),
        ),
      );
      await rtcalcInstanceService.deleteAll(instances);
      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        const redisConnector = await RedisConnector.getInstance();
        redisConnector.writeRTCalcInstruction(instance.uuid, {
          type: RTCalcInstructionsTypes.REINIT_RTCALC,
        });
      }
      resolve(true);
    }),
  );

  await Promise.all(promises);
}

async function redisDataInit() {
  const promises = [];

  const redisConnector = await RedisConnector.getInstance();

  if (!redisConnector) {
    return;
  }

  redisConnector.flushKeys();

  // writing sessions
  const userSessionService = new UserSessionService();
  const userSessions = await userSessionService.getActiveSessions();
  promises.push(redisConnector.writeUserSession(userSessions));

  // writing user id ship id mapping
  const userService = new UserService();
  const userIdsShipIds = await userService.getEveryUserShipId();
  for (let i = 0; i < userIdsShipIds.length; i++) {
    const userId = userIdsShipIds[i].user_id;
    const shipId = userIdsShipIds[i].ship_id;
    promises.push(redisConnector.writeUserIdShipId(userId, shipId));
  }

  // getting not parked ships
  const shipService = new ShipService();
  const mainMapHubService = new MainMapHubService();
  const ships = await shipService.getAllBy("is_parked", false);

  // writing not parked ships, getting active hubs
  const activeHubsFilters: Array<DBFilter<MainMapHubModel>> = [];
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    if (!ship.main_map_hub_id) {
      continue;
    }
    activeHubsFilters.push(new DBFilter("id", ship.main_map_hub_id));
    promises.push(shipService.writeShipToRedis(ship));
    promises.push(redisConnector.writeShipPosition(ship));
  }

  // writing active hubs
  if (activeHubsFilters.length) {
    const activeHubs = await mainMapHubService.getSearchAll(
      new SearchRequestData(0, 10000),
      activeHubsFilters,
      new ParametersLimit(["id"]),
    );
    for (let i = 0; i < activeHubs.items.length; i++) {
      const hub = activeHubs.items[i];
      promises.push(mainMapHubService.writeActiveHubToRedis(hub.id));
    }
  }

  await Promise.all(promises);
}

function cronJobsInit() {
  for (let i = 0; i < cronJobs.length; i++) {
    const job = cronJobs[i];
    job.start();
  }
}

export { dbDataInit, redisDataInit, cronJobsInit };
