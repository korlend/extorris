import DBModel from "@src/models/db/DBModel.js";
import MySQLConnector from "@src/core/MySQLConnector.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import DBError from "@src/models/DBError.js";
import IParsable from "@src/interfaces/IParsable.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import SearchData from "@src/models/SearchData.js";
import DBFilter from "@src/models/DBFilter.js";
import DBFilterBuilder from "@src/core/utils/db/DBFilterBuilder.js";
import ConfigLoader from "@src/core/config/ConfigLoader.js";
import DBCreateUpdateBuilder from "@src/core/utils/db/DBCreateUpdateBuilder.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";
import { DBOperand, FieldTypes, ModelPropertyMetadata } from "extorris-common";

export default abstract class Repository<
  T extends DBModel<T>,
  DBDataKeys extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>,
> {
  model: T;
  tableName: string;
  connector: MySQLConnector;
  target: string;
  keyAsId: string;
  config: ConfigLoader | null;

  constructor(model: T, keyAsId: string = "id") {
    this.config = ConfigLoader.getInstance();
    const dbConnection = this.config?.get("database.mysql");
    this.model = model;
    this.tableName = model._tableName;
    this.connector = MySQLConnector.getInstance(dbConnection);
    this.target = `${dbConnection.database}.${this.tableName}`;
    this.keyAsId = keyAsId;
  }

  protected _get(id: number, fields = new ParametersLimit<T>()): Promise<T> {
    if (!id) {
      throw new DBError();
    }
    fields = this.processFields(fields);
    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(", ")} from ${this.target}
      where id = ?
      `,
        [id],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  get(id: number, fields = new ParametersLimit<T>()): Promise<T> {
    return this._get(id, fields);
  }

  getByModel(model: T): Promise<T> {
    const fields = this.processFields();
    const sort_by = "id";
    const sort_direction = "desc";
    const parameters = this.model.parametersKeys(fields);

    const filters: Array<DBFilter<T>> = [];

    if (model.id) {
      filters.push(new DBFilter("id" as any, model.id));
    } else {
      for (let i = 0; i < parameters.length; i++) {
        const parameter = parameters[i];
        const value = model.getValue(parameter);
        if (!value) {
          continue;
        }
        filters.push(new DBFilter(parameter, value));
      }
    }

    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select ${parameters.join(",")} from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
      order by ?? ${sort_direction}
      limit ?,?
    `,
        filterBuilder.values.concat([sort_by]),
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  processFields(fields = new ParametersLimit<T>()) {
    if (!fields) {
      fields = new ParametersLimit<T>();
    }
    fields.exclude = [
      ...fields.exclude,
      ...(this.model._crudExclude as Array<DBDataKeys>),
    ];
    return fields;
  }

  protected async _anyModelFromDataPacket(
    dataObj: any,
    model: IParsable<any>,
  ): Promise<any> {
    if (!dataObj || (dataObj.length !== undefined && !dataObj[0])) {
      return null;
    }
    if (dataObj.length) {
      dataObj = dataObj[0];
    }
    return model.parseObject(dataObj);
  }

  protected async _modelFromDataPacket(dataObj: any): Promise<T> {
    return this._anyModelFromDataPacket(dataObj, this.model);
  }

  protected async _anyModelsFromDataPacket(dataObj: any): Promise<Array<any>> {
    const dataArray: Array<T> = [];

    for (let i = 0; i < dataObj.length; i++) {
      const data = await this.modelFromDataPacket(dataObj[i]);

      dataArray.push(data);
    }

    return dataArray;
  }

  protected async _modelsFromDataPacket(dataObj: any): Promise<Array<T>> {
    return this._anyModelsFromDataPacket(dataObj);
  }

  async modelFromDataPacket(dataObj: any): Promise<T> {
    return await this._modelFromDataPacket(dataObj);
  }

  async modelsFromDataPacket(dataObj: any): Promise<Array<T>> {
    return await this._modelsFromDataPacket(dataObj);
  }

  async arrayFromDataPacket<type>(
    dataObj: any,
    key: string,
  ): Promise<Array<type>> {
    const dataArray: Array<type> = [];

    for (let i = 0; i < dataObj.length; i++) {
      const row = dataObj[i];
      if (!row[key]) {
        continue;
      }
      dataArray.push(row[key]);
    }

    return dataArray;
  }

  protected _getBy<K extends DBDataKeys>(
    key: K,
    value: T[K],
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    fields = this.processFields(fields);
    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(", ")} from ${this.target}
      where ${key} = ?
    `,
        [value],
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getBy<K extends DBDataKeys>(
    key: K,
    value: T[K],
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    return this._getBy(key, value, fields);
  }

  protected _getAllBy<K extends DBDataKeys>(
    key: K,
    value: T[K],
    fields = new ParametersLimit<T>(),
    limit?: number,
  ): Promise<Array<T>> {
    fields = this.processFields(fields);
    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(", ")} from ${this.target}
      where ${key} = ?
      ${limit ? `limit 0,${limit}` : ""}
    `,
        [value],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getAllBy<K extends DBDataKeys>(
    key: K,
    value: T[K],
    fields = new ParametersLimit<T>(),
    limit?: number,
  ): Promise<Array<T>> {
    return this._getAllBy(key, value, fields, limit);
  }

  protected _getByMap(
    map: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    fields = this.processFields(fields);
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id is not null
      ${Array.from(map.keys())
        .map((v) => ` and ${v} = ? `)
        .join("")}
    `,
        Array.from(map.values()),
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getByMap(
    filters: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    return this._getByMap(filters, fields);
  }

  protected _getAllByMap(
    map: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    fields = this.processFields(fields);
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id is not null
      ${Array.from(map.keys())
        .map((v) => ` and ${v} = ? `)
        .join("")}
    `,
        Array.from(map.values()),
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getAllByMap(
    filters: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    return this._getAllByMap(filters, fields);
  }

  getExtraData(ids: Array<number>, byKey: string = "id"): Promise<Array<T>> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where ${byKey} not in (${ids.join(",")})
    `,
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getExtraImportData(
    ids: Array<number>,
    byKey: string = "id",
  ): Promise<Array<T>> {
    return this.connector
      .query(
        `
      select * from ${this.target}
      where ${byKey} not in (${ids.join(",")})
      and (is_local = 0 or is_local is null)
    `,
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  protected _getAll(
    from: number = 0,
    pageSize: number = 20,
    fields = new ParametersLimit<T>(),
    filters?: Array<DBFilter<T>>,
  ): Promise<Array<T>> {
    fields = this.processFields(fields);
    from = from ? parseInt(from.toString()) : 0;
    pageSize = pageSize ? parseInt(pageSize.toString()) : 0;

    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(",")} from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
      order by id
      ${pageSize ? `limit ${from},${pageSize}` : ""}
    `,
        filterBuilder.values.concat(pageSize ? [from, pageSize] : []),
      )
      .then(async (resp) => this.modelsFromDataPacket(resp));
  }

  getAll(
    from: number = 0,
    pageSize: number = 20,
    fields = new ParametersLimit<T>(),
    filters?: Array<DBFilter<T>>,
  ): Promise<Array<T>> {
    return this._getAll(from, pageSize, fields, filters);
  }

  getAllTable(): Promise<Array<T>> {
    return this.connector
      .query(
        `
    select * from ${this.target}
    `,
      )
      .then(async (resp) => this.modelsFromDataPacket(resp));
  }

  getSearchAll(
    searchRequestData: SearchRequestData,
    filters?: Array<DBFilter<T>>,
    fields = new ParametersLimit<T>(),
  ): Promise<SearchData<T>> {
    fields = this.processFields(fields);
    const { from, size, sort_by, sort_direction } = searchRequestData;

    if (!filters) {
      filters = [];
    }

    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(",")} from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
      order by ?? ${sort_direction}
      limit ?,?
    `,
        filterBuilder.values.concat([sort_by, from, size]),
      )
      .then(async (resp) => {
        const searchData = new SearchData<T>();
        searchData.items = await this.modelsFromDataPacket(resp);
        searchData.total = await this.getAllCount(filters);
        return searchData;
      });
  }

  getSearchSingle(
    filters?: Array<DBFilter<T>>,
    searchRequestData?: SearchRequestData,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    fields = this.processFields(fields);
    const sort_by = searchRequestData?.sort_by || "id";
    const sort_direction = searchRequestData?.sort_direction || "asc";

    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(",")} from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
      order by ?? ${sort_direction}
    `,
        filterBuilder.values.concat([sort_by]),
      )
      .then((resp) => this.modelFromDataPacket(resp));
  }

  getFastSearchAll(
    searchRequestData: SearchRequestData,
    searchText: string,
    fields = new ParametersLimit<T>(),
    filters: Array<DBFilter<T>> = [],
  ): Promise<SearchData<T>> {
    fields = this.processFields(fields);
    const { from, size, sort_by, sort_direction } = searchRequestData;

    const model = this.model;
    const keys = model.parametersKeys(fields);
    if (!filters) {
      filters = [];
    }

    if (searchText) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const metadata: ModelPropertyMetadata =
          model.getParameterAnnotations(key);
        let ignore = false;
        let operand: DBOperand = "=";
        let value: string | number = searchText;

        switch (metadata.fieldType) {
          case FieldTypes.FLOAT:
            value = parseFloat(value);
            break;
          case FieldTypes.INT:
          case FieldTypes.PRIMARY_KEY:
            value = parseInt(value);
            break;
          case FieldTypes.STRING:
          case FieldTypes.STRING_SELECT:
            value = `%${value}%`;
            operand = "like";
            break;
          // TODO: entity link search
          default:
            ignore = true;
            break;
        }
        if (ignore) {
          continue;
        }
        filters.push(new DBFilter(key, value as any, operand, "OR"));
      }
    }

    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select ${this.model.parametersKeys(fields).join(",")} from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
      order by ?? ${sort_direction}
      limit ?,?
    `,
        filterBuilder.values.concat([sort_by, from, size]),
      )
      .then(async (resp) => {
        const searchData = new SearchData<T>();
        searchData.items = await this.modelsFromDataPacket(resp);
        searchData.total = await this.getAllCount(filters);
        return searchData;
      });
  }

  getAllCount(filters?: Array<DBFilter<T>>): Promise<number> {
    const filterBuilder = new DBFilterBuilder(filters);

    return this.connector
      .query(
        `
      select count(*) as count from ${this.target}
      ${filterBuilder.query ? "where" : ""} ${filterBuilder.query}
    `,
        filterBuilder.values,
      )
      .then((resp) => {
        if (resp && resp.length) {
          resp = resp[0];
          return resp.count;
        }
        return 0;
      });
  }

  getAllByIds(ids: Array<number>): Promise<Array<T>> {
    if (!ids || !ids.length) {
      return new Promise((resolve: any) => resolve([]));
    }
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id in (${ids.map((v) => "?").join(",")})
    `,
        [...ids],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getAllByAll(
    values: Array<string | number | boolean>,
    key: string,
  ): Promise<Array<T>> {
    if (!values || !values.length || !key) {
      return new Promise((resolve: any) => resolve([]));
    }
    return this.connector
      .query(
        `
      select * from ${this.target}
      where ${key} in (${values.map((v) => "?").join(",")})
    `,
        [...values],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getByIdsFromTo(from: number, to: number): Promise<Array<T>> {
    from = from ? parseInt(from.toString()) : 0;
    to = to ? parseInt(to.toString()) : 0;
    return this.connector
      .query(
        `
      select * from ${this.target}
      where id >= ? and id <= ?
    `,
        [from, to],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  getByLinkedModel(
    linkedModel: DBModel<T>,
    mainModelIdKey: string,
    linkModelKey: string,
    linksTarget: string,
  ): Promise<Array<T>> {
    return this.connector
      .query(
        `
      select i.* from ${this.target} i
      left join ${linksTarget} em on i.id = em.${mainModelIdKey}
      where em.${linkModelKey} = ?
    `,
        [linkedModel.id],
      )
      .then((resp) => this.modelsFromDataPacket(resp));
  }

  linkWith(
    mainModel: T,
    mainModelIdKey: string,
    linksModels: Array<DBModel<T>>,
    linkModelKey: string,
    linksTarget: string,
  ): Promise<void> {
    return this.connector.query(
      `
      INSERT INTO ${linksTarget} (${mainModelIdKey}, ${linkModelKey})
      VALUES ${linksModels.map((v) => `(?, ?)`).toString()}
    `,
      linksModels
        .map((v) => [mainModel.id, v.id])
        .reduce((f, n) => f.concat(n)),
    );
  }

  removeLinks(
    mainModel: T,
    mainModelIdKey: string,
    linksModels: Array<DBModel<T>>,
    linkModelKey: string,
    linksTarget: string,
  ): Promise<any> {
    return this.connector.query(
      `
      DELETE FROM ${linksTarget}
      WHERE ${mainModelIdKey} = ? and
      ${linksModels.map((v) => `${linkModelKey} = ?`).join(" OR ")}
    `,
      [mainModel.id, ...linksModels.map((v) => v.id)],
    );
  }

  protected _create(model: T, fields = new ParametersLimit<T>()): Promise<T> {
    if (!model) {
      throw new DBError();
    }
    fields = this.processFields(fields);

    const createData = DBCreateUpdateBuilder.buildCreateData<T>(model, fields);

    return this.connector
      .query(
        `
      INSERT INTO ${this.target} (${createData.queryParameters})
      VALUES (${createData.queryValues})
    `,
        createData.values,
      )
      .then((resp) => {
        return this.get(resp.insertId);
      });
  }

  create(model: T, fields = new ParametersLimit<T>()): Promise<T> {
    return this._create(model, fields);
  }

  _update(model: T, fields = new ParametersLimit<T>()): Promise<T> {
    if (!model) {
      throw new DBError();
    }
    fields = this.processFields(fields);

    const updateData = DBCreateUpdateBuilder.buildUpdateData<T>(model, fields);
    return this.connector
      .query(
        `
        UPDATE ${this.target}
        SET ${updateData.queryParametersAndValues}
        WHERE id = ?
      `,
        [...updateData.values, model.id],
      )
      .then((resp) => {
        return this._get(model.id);
      });
  }

  update(model: T, fields = new ParametersLimit<T>()): Promise<T> {
    return this._update(model, fields);
  }

  async updateAll(
    models: Array<T>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    if (!models || !models.length) {
      return [];
    }
    fields = this.processFields(fields);

    const tableAlias = "trgt";
    const updateData = DBCreateUpdateBuilder.buildUpdateMultipleData<T>(
      models,
      tableAlias,
      fields,
    );

    return this.connector
      .query(
        `
        UPDATE ${this.target} ${tableAlias}
        ${updateData.queryParametersAndValues}
      `,
        updateData.values,
      )
      .then((resp) => {
        return this.getAllByIds(models.map((v) => v.id));
      });
  }

  async createAll(
    models: Array<T>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    if (!models || !models.length) {
      return [];
    }
    fields = this.processFields(fields);
    fields.exclude = [...fields.exclude, "id"] as Array<DBDataKeys>;

    const createData = DBCreateUpdateBuilder.buildArrayCreateData<T>(
      models,
      fields,
    );

    return this.connector
      .query(
        `
        INSERT INTO ${this.target}
        (${createData.queryParameters})
        VALUES
        ${createData.queryValues}
      `,
        createData.values,
      )
      .then((resp) => {
        let lastId = resp.insertId;
        models = models.map((v) => {
          return {
            ...v,
            id: lastId++,
          };
        });
        return this.getAllByIds(models.map((v) => v.id));
      });
  }

  delete(model: T): Promise<any> {
    if (!model || !model.id) {
      throw new DBError();
    }
    return this.connector.query(
      `
      DELETE FROM ${this.target}
      WHERE id = ?
    `,
      [model.id],
    );
  }

  deleteAll(models: Array<T>): Promise<any> {
    return this.connector.query(
      `
      DELETE FROM ${this.target}
      WHERE ${models.map((v) => "id = ?").join(" or ")}
    `,
      models.map((v) => v.id),
    );
  }
}
