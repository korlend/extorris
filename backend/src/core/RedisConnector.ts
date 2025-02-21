import {
  createClient,
  type RedisClientOptions,
  type RedisClientType,
} from "redis";

import { RedisModels } from "extorris-common";
import {
  MainMapHubModel,
  PortalModel,
  ShipArmorModel,
  ShipCannonModel,
  ShipEnergyCoreModel,
  ShipEngineModel,
  ShipHullModel,
  ShipModel,
  UserIslandModel,
  UserSessionModel,
} from "@src/models/db/index.js";

// TODO: better to split the connector from logic of separate redis logical sections
export default class RedisConnector {
  private static instance: RedisConnector;

  private config?: RedisClientOptions;
  private client: RedisClientType;

  private constructor(client: RedisClientType, config?: RedisClientOptions) {
    this.config = config;
    this.client = client;
    return this;
  }

  public get getClient() {
    return this.client;
  }

  public disconnect() {
    this.client.disconnect();
  }

  public static async getInstance(
    config?: RedisClientOptions,
  ): Promise<RedisConnector> {
    if (RedisConnector.instance) {
      return RedisConnector.instance;
    }

    const client = await createClient(config)
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();

    // @ts-expect-error
    return (RedisConnector.instance = new RedisConnector(client, config));
  }

  private buildUserSession(session: UserSessionModel): RedisModels.UserSession {
    return {
      id: session.id,
      user_id: session.user_id,
      token: session.token,
      expire: session.expire,
    };
  }

  private buildActiveHub(
    hub: MainMapHubModel,
    portals: Array<PortalModel>,
    userIslands: Array<UserIslandModel>,
    shipIds: Array<number>,
  ): RedisModels.ActiveHubData {
    const activeHub: RedisModels.ActiveHubData = {
      id: hub.id,
      portals: portals.map((portal) => {
        const isFrom = portal.from_hub_id === hub.id;
        const x = isFrom
          ? portal.from_hub_position_x
          : portal.to_hub_position_x;
        const y = isFrom
          ? portal.from_hub_position_y
          : portal.to_hub_position_y;
        return {
          id: portal.id,
          x,
          y,
        };
      }),
      userIslands: userIslands.map((island) => ({
        id: island.id,
        user_id: island.user_id,
        x: island.hub_pos_x,
        y: island.hub_pos_y,
      })),
      shipIds,
    };
    return activeHub;
  }

  private buildShipData(
    ship: ShipModel,
    shipArmor: ShipArmorModel,
    shipCannons: Array<ShipCannonModel>,
    shipEnergyCore: ShipEnergyCoreModel,
    shipEngine: ShipEngineModel,
    shipHull: ShipHullModel,
  ): RedisModels.ShipData {
    const shipData: RedisModels.ShipData = {
      id: ship.id,
      user_id: ship.user_id || 0,
      armor: {
        defense: shipArmor.defense,
      },
      cannons: shipCannons.map((cannon) => ({
        action_cooldown: cannon.action_cooldown,
        attack_power: cannon.attack_power,
        energy_consumption_per_action: cannon.energy_consumption_per_action,
      })),
      energyCore: {
        energy_capacity: shipEnergyCore.energy_capacity,
        energy_production: shipEnergyCore.energy_production,
      },
      engine: {
        acceleration: shipEngine.acceleration,
        energy_consumption: shipEngine.energy_consumption,
        max_speed: shipEngine.max_speed,
      },
      hull: {
        cannon_slots: shipHull.cannon_slots,
        energy_consumption_factor: shipHull.energy_consumption_factor,
        health_points: shipHull.health_points,
        maximum_crew: shipHull.maximum_crew,
        speed_factor: shipHull.speed_factor,
      },
    };

    return shipData;
  }

  private addUserSession(session: RedisModels.UserSession) {
    this.client.SET(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.USER_SESSIONS,
        session.token,
      ),
      JSON.stringify(session),
    );
    return;
  }

  public async writeUserSession(
    sessions: Array<UserSessionModel>,
  ): Promise<void>;
  public async writeUserSession(session: UserSessionModel): Promise<void>;
  public async writeUserSession(
    data: UserSessionModel | Array<UserSessionModel>,
  ): Promise<void>;
  public async writeUserSession(
    data: UserSessionModel | Array<UserSessionModel>,
  ) {
    if (data instanceof Array) {
      const redisUserSessions: Array<RedisModels.UserSession> = data.map(
        (session) => this.buildUserSession(session),
      );
      const promises = [];
      for (let i = 0; i < redisUserSessions.length; i++) {
        const item = redisUserSessions[i];
        promises.push(this.addUserSession(item));
      }
      await Promise.all(promises);
      return;
    }
    const redisUserSession: RedisModels.UserSession =
      this.buildUserSession(data);
    this.addUserSession(redisUserSession);
  }

  // TODO: make atomic, maybe make a queue and rtcalc worker is responsible for writing data
  // or maybe we are doing it 1 time during first boot? - no
  // more logic will be here, probably, nests, islands, monsters, trees
  // split hubs by keys and make a ids list of active hubs
  public async writeActiveHub(
    hub: MainMapHubModel,
    portals: Array<PortalModel>,
    userIslands: Array<UserIslandModel>,
    shipIds: Array<number>,
  ) {
    // pushing hub id to set
    await this.client.SADD(
      RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUBS_SET),
      hub.id.toString(),
    );

    // adding active hub
    const builtActiveHub = this.buildActiveHub(
      hub,
      portals,
      userIslands,
      shipIds,
    );
    this.client.SET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUB, hub.id),
      JSON.stringify(builtActiveHub),
    );
  }

  public async writeShipData(
    ship: ShipModel,
    shipArmor: ShipArmorModel,
    shipCannons: Array<ShipCannonModel>,
    shipEnergyCore: ShipEnergyCoreModel,
    shipEngine: ShipEngineModel,
    shipHull: ShipHullModel,
  ) {
    const shipData = this.buildShipData(
      ship,
      shipArmor,
      shipCannons,
      shipEnergyCore,
      shipEngine,
      shipHull,
    );
    await this.client.SET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.SHIP_DATA, ship.id),
      JSON.stringify(shipData),
    );
  }

  public async writeShipPosition(ship: ShipModel, userIsland: UserIslandModel) {
    const shipPosition: RedisModels.ShipPosition = {
      id: ship.id,
      user_id: ship.user_id || 0,
      x: userIsland.hub_pos_x,
      y: userIsland.hub_pos_y,
      speed: 0,
      angle: 0,
      hp: 1000,
      lastUpdate: new Date().getTime(),
    };
    await this.client.SET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.SHIP_POSITION, ship.id),
      JSON.stringify(shipPosition),
    );
  }

  public deleteUserSession(sessionToken: string) {
    return this.client.DEL(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.USER_SESSIONS,
        sessionToken,
      ),
    );
  }

  public async getUserSession(
    sessionToken: string,
  ): Promise<RedisModels.UserSession | null> {
    const data = await this.client.GET(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.USER_SESSIONS,
        sessionToken,
      ),
    );
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  public async writeUserIdShipId(userId: number, shipId: number) {
    this.client.SET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.USER_ID_SHIP_ID, userId),
      shipId,
    );
  }

  public flushKeys() {
    return this.client.FLUSHALL();
  }
}
