import {
  createClient,
  type RedisClientOptions,
  type RedisClientType,
} from "redis";

import { RedisModels } from "extorris-common";

export default class RedisConnector {
  private static instance: RedisConnector;

  private config?: RedisClientOptions;
  private client: RedisClientType;

  private userSessionsKey = RedisModels.DataKeys.USER_SESSIONS;

  private constructor(client: RedisClientType, config?: RedisClientOptions) {
    this.config = config;
    this.client = client;
    return this;
  }

  private formUserSessionKey(sessionToken: string) {
    return `${this.userSessionsKey}:${sessionToken}`;
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

  public async getUserSession(
    sessionToken: string,
  ): Promise<RedisModels.UserSession | null> {
    const data = await this.client.GET(this.formUserSessionKey(sessionToken));
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  public async getShipsPositions(
    shipIds: Array<number>,
  ): Promise<Array<RedisModels.ShipPosition>>;
  public async getShipsPositions(
    shipId: number,
  ): Promise<RedisModels.ShipPosition | null>;
  public async getShipsPositions(
    shipIds: number | Array<number>,
  ): Promise<
    (RedisModels.ShipPosition | null) | Array<RedisModels.ShipPosition>
  >;
  public async getShipsPositions(
    shipIds: number | Array<number>,
  ): Promise<
    (RedisModels.ShipPosition | null) | Array<RedisModels.ShipPosition>
  > {
    if (shipIds instanceof Array) {
      const promises = [];
      for (let i = 0; i < shipIds.length; i++) {
        const shipId = shipIds[i];
        promises.push(this.getShipsPositions(shipId));
      }
      return await Promise.all(promises).then((shipPositions) =>
        shipPositions.filter((v) => !!v),
      );
    }
    const data = await this.client.GET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.SHIP_POSITION, shipIds),
    );
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  public async getActiveHubsIds(rtcalcUuid: string): Promise<Array<number>> {
    const data = await this.client.SMEMBERS(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.ACTIVE_HUBS_SET,
        rtcalcUuid,
      ),
    );
    if (!data) {
      return [];
    }
    const parsedData = data.map((v) => parseInt(v));
    return parsedData;
  }

  public async getActiveRTCalcInstances() {
    const data = await this.client.SMEMBERS(
      RedisModels.buildRedisKey(RedisModels.DataKeys.RTCALC_INSTANCES),
    );
    return data;
  }

  public async getActiveHubs(
    rtcalcUuid: string,
  ): Promise<Array<RedisModels.ActiveHubData>>;
  public async getActiveHubs(
    hubsId: number,
  ): Promise<RedisModels.ActiveHubData | null>;
  public async getActiveHubs(
    hubsIds: Array<number>,
  ): Promise<Array<RedisModels.ActiveHubData>>;
  public async getActiveHubs(
    data: number | Array<number> | string,
  ): Promise<
    Array<RedisModels.ActiveHubData> | (RedisModels.ActiveHubData | null) | null
  > {
    if (typeof data === "number") {
      const hubData = await this.client.GET(
        RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUB, data),
      );
      if (!hubData) {
        return null;
      }
      const parsedData = JSON.parse(hubData);
      return parsedData as RedisModels.ActiveHubData;
    }

    if (typeof data === "string") {
      data = await this.getActiveHubsIds(data);
    }

    const promises: Array<Promise<RedisModels.ActiveHubData | null>> = [];
    for (let i = 0; i < data.length; i++) {
      const hubId = data[i];
      promises.push(this.getActiveHubs(hubId));
    }
    return Promise.all(promises).then((hubs) => hubs.filter((hub) => !!hub));
  }

  public async writeShipUserInstructions(
    shipId: number,
    instruction: RedisModels.ShipUserInstruction,
  ): Promise<void> {
    await this.client.SET(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.SHIP_USER_INSTRUCTIONS,
        shipId,
      ),
      JSON.stringify(instruction),
    );
  }

  // returns ship id
  public async getUserIdShipId(userId: number): Promise<number | null> {
    const shipId = await this.client.GET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.USER_ID_SHIP_ID, userId),
    );
    if (!shipId) {
      return null;
    }
    return parseInt(shipId);
  }
}
