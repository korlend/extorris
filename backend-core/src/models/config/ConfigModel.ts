
export type ConfigModelDB = {
  host: String;
  user: String;
  password: String;
  database: String;
  port: Number;
};

export default class ConfigModel {
  database?: ConfigModelDB;

  constructor(database: ConfigModelDB) {
    this.database = database;
  }
}
