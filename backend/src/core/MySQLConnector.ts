import {
  createPool,
  FieldPacket,
  Pool,
  PoolOptions,
  QueryError,
} from "mysql2";

export default class MySQLConnector {
  private static instance: MySQLConnector;

  private poolConfig: PoolOptions;
  private connectionPool!: Pool;

  private constructor(poolConfig: PoolOptions) {
    this.poolConfig = poolConfig;
    this.createPool();
    return this;
  }

  public get scheme() {
    return this.poolConfig.database;
  }

  public static getInstance(poolConfig?: PoolOptions): MySQLConnector {
    if (MySQLConnector.instance) {
      return MySQLConnector.instance;
    }

    if (!poolConfig) {
      throw new Error("No db config presented during connector initialization");
    }

    return (MySQLConnector.instance = new MySQLConnector(poolConfig));
  }

  private createPool() {
    this.connectionPool = createPool(this.poolConfig);
  }

  public query(
    sql: string,
    values: Array<any> = [],
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connectionPool) {
        try {
          this.createPool();
        } catch (ex) {
          reject(new Error(`connection is not initialized, ${ex}`));
        }
      }
      this.connectionPool.query(
        sql,
        values,
        (err: QueryError | null, results?: any, fields?: FieldPacket[]) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(results);
        },
      );
      // alternative?
      // this.connectionPool.getConnection((err: MysqlError, connection: PoolConnection) => {})
    });
  }
}
