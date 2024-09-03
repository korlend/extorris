"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
class MySQLConnector {
    static instance;
    poolConfig;
    connectionPool;
    constructor(poolConfig) {
        this.poolConfig = poolConfig;
        this.createPool();
        return this;
    }
    static getInstance(poolConfig) {
        if (MySQLConnector.instance) {
            return MySQLConnector.instance;
        }
        if (!poolConfig) {
            throw new Error('No db config presented during connector initialization');
        }
        return MySQLConnector.instance = new MySQLConnector(poolConfig);
    }
    createPool() {
        this.connectionPool = (0, mysql_1.createPool)(this.poolConfig);
    }
    query(sql, values = []) {
        return new Promise((resolve, reject) => {
            if (!this.connectionPool) {
                try {
                    this.createPool();
                }
                catch (ex) {
                    reject(new Error(`connection is not initialized, ${ex}`));
                }
            }
            this.connectionPool.query(sql, values, (err, results, fields) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}
exports.default = MySQLConnector;
//# sourceMappingURL=MySQLConnector.js.map