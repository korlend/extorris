import RedisConnector from "@src/core/RedisConnector.js";
import { MainMapHubModel } from "@src/models/db/index.js";
import DBFilter from "@src/models/DBFilter.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import MainMapHubService from "@src/services/main_map/MainMapHubService.js";
import ShipService from "@src/services/ship/ShipService.js";
import { CronJob } from "cron";

export default CronJob.from({
  cronTime: "*/10 * * * * *",
  onTick: async () => {
    const redisConnector = await RedisConnector.getInstance();

    if (!redisConnector) {
      return;
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
      // await shipService.writeShipToRedis(ship);
      // await redisConnector.writeShipPosition(ship);
    }

    // writing active hubs
    if (activeHubsFilters.length) {
      const activeHubs = await mainMapHubService.getSearchAll(
        new SearchRequestData(0, 10000),
        activeHubsFilters,
        new ParametersLimit(["id"]),
      );
      // redisConnector.
      for (let i = 0; i < activeHubs.items.length; i++) {
        const hub = activeHubs.items[i];
        await mainMapHubService.writeActiveHubToRedis(hub.id);
      }
    }
  },
});