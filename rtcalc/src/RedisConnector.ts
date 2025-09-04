import {
  createClient,
  type RedisClientOptions,
  type RedisClientType,
} from "redis";

import { RedisModels } from "extorris-common";

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

  public get isOpen() {
    return this.client.isOpen;
  }

  public get isReady() {
    return this.client.isReady;
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

  public async getShipData(
    shipId: number,
  ): Promise<RedisModels.ShipData | null>;
  public async getShipData(
    shipIds: Array<number>,
  ): Promise<Array<RedisModels.ShipData>>;
  public async getShipData(
    data: number | Array<number>,
  ): Promise<RedisModels.ShipData | null | Array<RedisModels.ShipData>> {
    if (data instanceof Array) {
      const promises: Array<Promise<RedisModels.ShipData | null>> = [];
      for (let i = 0; i < data.length; i++) {
        promises.push(this.getShipData(data[i]));
      }
      return Promise.all(promises).then((resp) => resp.filter((v) => !!v));
    }
    const response = await this.client.GET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.SHIP_DATA, data),
    );
    if (!response) {
      return null;
    }
    const parsedData = JSON.parse(response);
    return parsedData;
  }

  public async getShipPosition(
    shipId: number,
  ): Promise<RedisModels.ShipPosition | null> {
    const data = await this.client.GET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.SHIP_POSITION, shipId),
    );
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData;
  }

  public async writeActiveHub(
    rtcalcUuid: string,
    activeHub: RedisModels.ActiveHubData,
  ) {
    await this.client.SADD(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.ACTIVE_HUBS_SET,
        rtcalcUuid,
      ),
      activeHub.id.toString(),
    );
    await this.client.SET(
      RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUB, activeHub.id),
      JSON.stringify(activeHub),
    );
  }

  public async removeActiveHub(rtcalcUuid: string, activeHubId: number) {
    await this.client.SREM(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.ACTIVE_HUBS_SET,
        rtcalcUuid,
      ),
      activeHubId.toString(),
    );
    await this.client.DEL(
      RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUB, activeHubId),
    );
  }

  public async writeShipPosition(
    shipPosition: RedisModels.ShipPosition,
  ): Promise<void> {
    await this.client.SET(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.SHIP_POSITION,
        shipPosition.id,
      ),
      JSON.stringify(shipPosition),
    );
  }

  public async getShipUserInstructions(
    shipId: number,
  ): Promise<RedisModels.ShipUserInstruction | null> {
    const data = await this.client.GET(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.SHIP_USER_INSTRUCTIONS,
        shipId,
      ),
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

  public async getRTCalcInstructions(
    rtcalcUuid: string,
  ): Promise<Array<RedisModels.RTCalcInstructionData>> {
    const length = await this.client.LLEN(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.RTCALC_INSTRUCTIONS,
        rtcalcUuid,
      ),
    );
    const data = await this.client.LPOP_COUNT(
      RedisModels.buildRedisKey(
        RedisModels.DataKeys.RTCALC_INSTRUCTIONS,
        rtcalcUuid,
      ),
      length,
    );
    if (!data) {
      return [];
    }
    return data.map((v) => JSON.parse(v));
  }

  public async getActiveHubs(
    rtcalcUuid: string,
  ): Promise<Array<RedisModels.ActiveHubData>>;
  public async getActiveHubs(
    hubId: number,
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
}
