import DBModel from "@src/models/db/DBModel.js";
import IParsable from "@src/interfaces/IParsable.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import DBFilter from "@src/models/DBFilter.js";
import Repository from "@src/repositories/Repository.js";
import SearchRequestData from "@src/models/SearchRequestData.js";
import SearchData from "@src/models/SearchData.js";
import PropagatedError from "@src/models/PropagatedError.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

export default abstract class Service<
  T extends DBModel<T> & IParsable<T>,
  TRepo extends Repository<T>,
  DBDataKeys extends DBModelDBDataKeys<T> = DBModelDBDataKeys<T>,
> {
  repo: TRepo;
  // operationLogService: OperationLogService

  constructor(repo: TRepo) {
    this.repo = repo;
  }

  async get(
    id: number,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    return this.repo.get(id, fields);
  }

  async getByModel(model: T): Promise<T> {
    return this.repo.getByModel(model);
  }

  async getBy(key: DBDataKeys, value: T[DBDataKeys]): Promise<T> {
    return this.repo.getBy(key, value);
  }

  async getAllBy(key: DBDataKeys, value: T[DBDataKeys]): Promise<Array<T>> {
    return this.repo.getAllBy(key, value);
  }

  async getRange(id: number | string): Promise<T | Array<T>> {
    id = id.toString();
    if (id && id.includes("-")) {
      id = id;
      const from = parseInt(id.split("-")[0]);
      const to = parseInt(id.split("-")[1]);
      return this.getByIdsFromTo(from, to);
    }
    return this.repo.get(parseInt(id));
  }

  async getAll(
    from: number = 0,
    pageSize: number = 10,
    fields = new ParametersLimit<T>(),
    filters?: Array<DBFilter<T>>,
  ): Promise<Array<T>> {
    return this.repo.getAll(from, pageSize, fields, filters);
  }

  async getSearchAll(
    searchRequestData: SearchRequestData,
    fields = new ParametersLimit<T>(),
    filters?: Array<DBFilter<T>>,
  ): Promise<SearchData<T>> {
    return this.repo.getSearchAll(searchRequestData, fields, filters);
  }

  async getSearchSingle(
    filters?: Array<DBFilter<T>>,
    searchRequestData?: SearchRequestData,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    return this.repo.getSearchSingle(filters, searchRequestData, fields);
  }

  async getFastSearchAll(
    searchRequestData: SearchRequestData,
    searchText: string,
    fields = new ParametersLimit<T>(),
    filters: Array<DBFilter<T>> = [],
  ): Promise<SearchData<T>> {
    return this.repo.getFastSearchAll(
      searchRequestData,
      searchText,
      fields,
      filters,
    );
  }

  async getAllCount(filters?: Array<DBFilter<T>>): Promise<number> {
    return this.repo.getAllCount(filters);
  }

  async getAllByIds(ids: Array<number>): Promise<Array<T>> {
    return this.repo.getAllByIds(ids);
  }

  async getByIdsFromTo(from: number, to: number): Promise<Array<T>> {
    return this.repo.getByIdsFromTo(from, to);
  }

  async updateLinks(oldModel: T, newModel: T) {
    return newModel;
  }

  async getByMap(
    filters: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    return this.repo.getByMap(filters, fields);
  }

  async _create(
    model: T,
    fields = new ParametersLimit<T>(),
    updateLinks = true,
  ): Promise<T> {
    let newModel = await this.repo.create(model, fields);
    if (updateLinks) {
      newModel = await this.updateLinks(model, newModel);
    }
    return newModel;
  }

  async create(
    model: T,
    fields = new ParametersLimit<T>(),
    updateLinks = true,
  ): Promise<T> {
    return this._create(model, fields, updateLinks);
  }

  async _update(
    model: T,
    fields = new ParametersLimit<T>(),
    updateLinks = true,
  ): Promise<T> {
    const oldModel = await this.repo.get(model.id);
    if (!oldModel) {
      throw new Error(`Record doesn't exist`);
    }
    let newModel = await this.repo.update(model, fields);
    if (updateLinks) {
      await this.updateLinks(model, newModel);
    }
    return newModel;
  }

  async update(
    model: T,
    fields = new ParametersLimit<T>(),
    updateLinks = true,
  ): Promise<T> {
    if (!model.id) {
      throw new PropagatedError(
        ExpressResponseTypes.ERROR,
        "ID is not specified to update entity",
      );
    }
    return this._update(model, fields, updateLinks);
  }

  async _delete(id: number): Promise<void> {
    let model = await this.repo.get(id);
    await this.repo.delete(model);
  }

  async delete(id: number): Promise<void> {
    return this._delete(id);
  }

  async createUpdate(
    data: T,
    getBy: Array<DBDataKeys> = [],
    fields = new ParametersLimit<T>(),
  ): Promise<T> {
    if (!getBy.length) {
      getBy.push("id" as any);
    }
    const filters: Array<DBFilter<T>> = [];
    getBy.forEach((v) => filters.push(new DBFilter(v, data.getValue(v), "=", "AND")))

    let dbData = await this.repo.getSearchSingle(filters, new SearchRequestData(), fields);
    if (!dbData) {
      dbData = await this.repo.create(data, fields);
    }
    // if (dbData && !dbData.equal(data, fields)) {
    else {
      data.id = dbData.id;
      dbData = await this.repo.update(data, fields);
    }
    return dbData;
  }

  async createUpdateAll(
    models: Array<T>,
    getBy: Array<DBDataKeys> = [],
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    if (!models || !models.length) {
      return [];
    }
    const resultModels = [];
    for (let i = 0; i < models.length; i++) {
      resultModels.push(await this.createUpdate(models[i], getBy, fields));
    }
    return resultModels;
  }

  async createAll(
    models: Array<T>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    if (!models || !models.length) {
      return [];
    }
    const createdModels = await this.repo.createAll(models, fields);
    return createdModels;
  }

  async updateAll(
    models: Array<T>,
    fields = new ParametersLimit<T>(),
  ): Promise<Array<T>> {
    const createdModels = await this.repo.updateAll(models, fields);
    return createdModels;
  }

  async deleteAll(ids: Array<number>): Promise<void> {
    const oldModels = await this.getAllByIds(ids);
    await this.repo.deleteAll(oldModels);
  }

  async getAllByMap(
    filters: Map<String, any>,
    fields = new ParametersLimit<T>(),
  ) {
    return this.repo.getAllByMap(filters, fields);
  }
}
