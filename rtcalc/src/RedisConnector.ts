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

  public async getActiveHubsIds(): Promise<Array<number>> {
    const data = await this.client.SMEMBERS(
      RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUBS_SET),
    );
    if (!data) {
      return [];
    }
    const parsedData = data.map(v => parseInt(v));
    return parsedData;
  }

  public async getActiveHubs(): Promise<Array<RedisModels.ActiveHubData>>;
  public async getActiveHubs(
    hubsId: number,
  ): Promise<RedisModels.ActiveHubData | null>;
  public async getActiveHubs(
    hubsIds?: Array<number>,
  ): Promise<Array<RedisModels.ActiveHubData>>;
  public async getActiveHubs(
    hubsIds?: number | Array<number>,
  ): Promise<
    Array<RedisModels.ActiveHubData> | (RedisModels.ActiveHubData | null) | null
  > {
    if (typeof hubsIds === "number") {
      const data = await this.client.GET(
        RedisModels.buildRedisKey(RedisModels.DataKeys.ACTIVE_HUB, hubsIds),
      );
      if (!data) {
        return null;
      }
      const parsedData = JSON.parse(data);
      return parsedData;
    }

    if (!hubsIds) {
      hubsIds = await this.getActiveHubsIds();
    }

    const promises: Array<Promise<RedisModels.ActiveHubData | null>> = [];
    for (let i = 0; i < hubsIds.length; i++) {
      const hubId = hubsIds[i];
      promises.push(this.getActiveHubs(hubId));
    }
    return Promise.all(promises).then((hubs) => hubs.filter((hub) => !!hub));
  }
}
