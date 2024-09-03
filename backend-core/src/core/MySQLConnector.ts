
import {
    createPool,
    FieldInfo,
    MysqlError,
    Pool,
    PoolConfig,
    QueryOptions,
} from "mysql"

export default class MySQLConnector {

  private static instance: MySQLConnector

  private poolConfig: PoolConfig
  private connectionPool!: Pool

  private constructor(poolConfig: PoolConfig) {
    this.poolConfig = poolConfig
    this.createPool()
    return this
  }

  public static getInstance(poolConfig?: PoolConfig): MySQLConnector {
    if (MySQLConnector.instance) {
      return MySQLConnector.instance
    }

    if (!poolConfig) {
      throw new Error('No db config presented during connector initialization')
    }

    return MySQLConnector.instance = new MySQLConnector(poolConfig)
  }

  private createPool() {
    this.connectionPool = createPool(this.poolConfig)
  }

  public query(sql: string | QueryOptions, values: Array<any> = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connectionPool) {
        try {
          this.createPool()
        } catch (ex) {
          reject(new Error(`connection is not initialized, ${ex}`))
        }
      }
      this.connectionPool.query(sql, values, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(results)
      })
      // alternative?
      // this.connectionPool.getConnection((err: MysqlError, connection: PoolConnection) => {})
    })
  }
}

