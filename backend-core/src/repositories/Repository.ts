
// import DBModel from "../interfaces/DBModel";
import MySQLConnector from "src/core/MySQLConnector";
import ParametersLimit from "src/models/ParametersLimit";

export default abstract class Repository<T extends DBModel<T>> {

  model: T
  tableName: string
  target: string
  keyAsId: string
  connector: MySQLConnector

  constructor (model: T, tableName: string, keyAsId: string = 'id') {
    this.model = model
    this.tableName = tableName
    this.target = `${scheme}.${this.tableName}`
    this.connector = MySQLConnector.getInstance()
    this.keyAsId = keyAsId;
  }

  protected getInternal(id: number, fields: ParametersLimit = new ParametersLimit()): Promise<T> | null {
    if (!id) {
      return null
    }
    fields = this.processFields(fields)
    return this.connecter.query(`
      select ${this.model.parametersKeysSnake(fields).join(', ')} from ${this.target}
      where id = ?
      ${this.defaultFilters()}
      `, [id]
    ).then(resp => this.modelFromDataPacket(resp))
  }

  get (id: number, fields: ParametersLimit = new ParametersLimit()): Promise<T> {
    return this.getInternal(id, fields)
  }

  processFields (fields: ParametersLimit = new ParametersLimit()) {
    if (!fields) {
      fields = new ParametersLimit()
    }
    fields.exclude = [...fields.exclude, ...this.model._crudExclude]
    return fields
  }

  protected async _anyModelFromDataPacket (dataObj: any, model: IParsable<any>): Promise<any> {
    if (!dataObj || (dataObj.length !== undefined && !dataObj[0])) {
      return null
    }
    if (dataObj.length) {
      dataObj = dataObj[0]
    }
    return model.fromObject(dataObj)
  }

  protected async _modelFromDataPacket (dataObj: any): Promise<T> {
    return this._anyModelFromDataPacket(dataObj, this.model)
  }

  protected async _anyModelsFromDataPacket (dataObj: any, model: IParsable<any>): Promise<Array<any>> {
    const dataArray: Array<T> = []

    for (let i = 0; i < dataObj.length; i++) {
      const data = await this.modelFromDataPacket(dataObj[i])

      dataArray.push(data)
    }

    return dataArray;
  }

  protected async _modelsFromDataPacket (dataObj: any): Promise<Array<T>> {
    return this._anyModelsFromDataPacket(dataObj, this.model)
  }

  async modelFromDataPacket (dataObj: any): Promise<T> {
    return await this._modelFromDataPacket(dataObj)
  }

  async modelsFromDataPacket (dataObj: any): Promise<Array<T>> {
    return await this._modelsFromDataPacket(dataObj)
  }

//   async arrayFromDataPacket<type> (dataObj: any, key: string): Promise<Array<type>> {
//     const dataArray: Array<type> = []

//     for (let i = 0; i < dataObj.length; i++) {
//       const row = dataObj[i]
//       if (!row[key]) {
//         continue
//       }
//       dataArray.push(row[key])
//     }

//     return dataArray;
//   }

//   protected getByInternal (key: string, value: any, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       select ${this.model.parametersKeysSnake(fields).join(', ')} from ${this.target}
//       where ${key} = ?
//       ${this.defaultFilters()}
//     `, [value]).then(resp => this.modelFromDataPacket(resp))
//   }

//   getBy (key: string, value: any, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     return this.getByInternal(key, value, fields)
//   }

//   protected getAllByInternal (key: string, value: any, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       select ${this.model.parametersKeysSnake(fields).join(', ')} from ${this.target}
//       where ${key} = ?
//       ${this.defaultFilters()}
//     `, [value]).then(resp => this.modelsFromDataPacket(resp))
//   }

//   getAllBy (key: string, value: any, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     return this.getAllByInternal(key, value, fields)
//   }

//   protected getByMapInternal (map: Map<String, any>, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       select * from ${this.target}
//       where id is not null
//       ${this.defaultFilters()}
//       ${Array.from(map.keys()).map(v => ` and ${v} = ? `).join('')}
//     `, Array.from(map.values())).then(resp => this.modelFromDataPacket(resp))
//   }

//   getByMap (filters: Map<String, any>, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     return this.getByMapInternal(filters, fields)
//   }

//   protected getAllByMapInternal (map: Map<String, any>, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       select * from ${this.target}
//       where id is not null
//       ${this.defaultFilters()}
//       ${Array.from(map.keys()).map(v => ` and ${v} = ? `).join('')}
//     `, Array.from(map.values())).then(resp => this.modelsFromDataPacket(resp))
//   }

//   getAllByMap (filters: Map<String, any>, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     return this.getAllByMapInternal(filters, fields)
//   }

//   getExtraData (ids: Array<number>, byKey: string = 'id'): Promise<Array<T>> {
//     return this.connecter.query(`
//       select * from ${this.target}
//       where ${byKey} not in (${ids.join(',')})
//       ${this.defaultFilters()}
//     `).then(resp => this.modelsFromDataPacket(resp))
//   }

//   getExtraImportData (ids: Array<number>, byKey: string = 'id'): Promise<Array<T>> {
//     return this.connecter.query(`
//       select * from ${this.target}
//       where ${byKey} not in (${ids.join(',')})
//       and (is_local = 0 or is_local is null)
//       ${this.defaultFilters()}
//     `).then(resp => this.modelsFromDataPacket(resp))
//   }

//   protected getAllInternal (from: number = 0, pageSize: number = 20, fields: FieldsExclusive = new FieldsExclusive(), filters: Map<String, {equality: string, value: string}> = new Map()): Promise<Array<T>> {
//     fields = this.processFields(fields)
//     from = from ? parseInt(from.toString()) : 0
//     pageSize = pageSize ? parseInt(pageSize.toString()) : 0
//     return this.connecter.query(`
//       select ${this.model.parametersKeysSnake(fields).join(',')} from ${this.target}
//       where id is not null
//       ${this.defaultFilters()}
//       ${Array.from(filters.keys()).map(v => `and ${v} ${filters.get(v).equality || '='} ${filters.get(v).value !== undefined && filters.get(v).value !== null ? '?' : ''}\n`).join('')}
//       order by id
//       ${pageSize ? `limit ${from},${pageSize}` : ''}
//     `, [...Array.from(filters.values()).filter(v => v.value !== undefined && v.value !== null).map(v => v.value), ...(pageSize ? [from, pageSize] : [])]).then(async resp => this.modelsFromDataPacket(resp))
//   }

//   getAll (from: number = 0, pageSize: number = 20, fields: FieldsExclusive = new FieldsExclusive(), filters: Map<String, {equality: string, value: string}> = new Map()): Promise<Array<T>> {
//     return this.getAllInternal(from, pageSize, fields, filters)
//   }

//   getAllTable (): Promise<Array<T>> {
//     return this.connecter.query(`
//     select * from ${this.target}
//     `).then(async resp => this.modelsFromDataPacket(resp))
//   }

//   /*
//   * In case if current entity table scheme doesn't contains mall_id directly,
//   * you should override this function inside these entity repository
//   */
//   getSearchAll (searchRequestData: SearchRequestData, fields: FieldsExclusive = new FieldsExclusive()): Promise<SearchData<T>> {
//     fields = this.processFields(fields)
//     const {
//       from,
//       size,
//       sort_by,
//       sort_direction,
//       mall_id
//     } = searchRequestData
//     return this.connecter.query(`
//       select ${this.model.parametersKeysSnake(fields).join(',')} from ${this.target}
//       where id is not null
//       ${mall_id ? `and mall_id = ${mall_id}` : ''}
//       ${this.defaultFilters()}
//       order by ?? ${sort_direction}
//       limit ?,?
//     `, [sort_by, from, size]).then(async resp => {
//       const searchData = new SearchData<T>()
//       searchData.items = await this.modelsFromDataPacket(resp)
//       searchData.total = await this.getAllCount('mall_id', searchRequestData.mall_id)
//       return searchData
//     })
//   }

//   getAllCount (key?: string, value?: any, filters: Map<String, {equality: string, value: string}> = new Map()): Promise<number> {
//     return this.connecter.query(`
//       select count(*) as count from ${this.target}
//       where id is not null
//       ${this.defaultFilters()}
//       ${(key && value) ? `and ${key} = ${value}` : ''}
//       ${Array.from(filters.keys()).map(v => `and ${v} ${filters.get(v).equality || '='} ${filters.get(v).value ? '?' : ''}\n`).join('')}
//     `, Array.from(filters.values()).filter(v => v.value !== undefined).map(v => v.value)).then(resp => {
//       if (resp && resp.length) {
//         resp = resp[0]
//         return resp.count
//       }
//       return 0
//     })
//   }

//   getCountAllByMall (mallId: number): Promise<number> {
//     return this.connecter.query(`
//       select count(*) as count from ${this.target}
//       where mall_id = ?
//       ${this.defaultFilters()}
//     `, [mallId]).then(resp => {
//       if (resp && resp.length) {
//         resp = resp[0]
//         return resp.count
//       }
//       return 0
//     })
//   }

//   getAllByMall (from: number, size: number, mallId: number): Promise<Array<T>> {
//     return this.getAll(from, size)
//   }

//   getAllMallsIds (model: T): Promise<Array<number>> {
//     return null
//   }

//   getAllByIds (ids: Array<number>): Promise<Array<T>> {
//     if (!ids || !ids.length) {
//       return new Promise((resolve: any) => resolve([]))
//     }
//     return this.connecter.query(`
//       select * from ${this.target}
//       where id in (${ids.map(v => '?').join(',')})
//       ${this.defaultFilters()}
//     `, [...ids]).then(resp => this.modelsFromDataPacket(resp))
//   }

//   getAllByAll (values: Array<string | number | boolean>, key: string): Promise<Array<T>> {
//     if (!values || !values.length || !key) {
//       return new Promise((resolve: any) => resolve([]))
//     }
//     return this.connecter.query(`
//       select * from ${this.target}
//       where ${key} in (${values.map(v => '?').join(',')})
//       ${this.defaultFilters()}
//     `, [...values]).then(resp => this.modelsFromDataPacket(resp))
//   }

//   async getMallId (model: T): Promise<number> {
//     return model ? model.getMallId() : null
//   }

//   getByIdsFromTo (from: number, to: number): Promise<Array<T>> {
//     from = from ? parseInt(from.toString()) : 0
//     to = to ? parseInt(to.toString()) : 0
//     return this.connecter.query(`
//       select * from ${this.target}
//       where id >= ? and id <= ?
//       ${this.defaultFilters()}
//     `, [from, to]).then(resp => this.modelsFromDataPacket(resp))
//   }

//   getByLinkedModel (linkedModel: Model, mainModelIdKey: string, linkModelKey: string, linksTarget: string): Promise<Array<T>> {
//     return this.connecter.query(`
//       select i.* from ${this.target} i
//       left join ${linksTarget} em on i.id = em.${mainModelIdKey}
//       where em.${linkModelKey} = ?
//       ${this.defaultFilters('i')}
//     `, [linkedModel.id]).then(resp => this.modelsFromDataPacket(resp))
//   }

//   linkWith (mainModel: T, mainModelIdKey: string, linksModels: Array<Model>, linkModelKey: string, linksTarget: string): Promise<void> {
//     return this.connecter.query(`
//       INSERT INTO ${linksTarget} (${mainModelIdKey}, ${linkModelKey})
//       VALUES ${linksModels.map(v => `(?, ?)`).toString()}
//     `, linksModels.map(v => [mainModel.id, v.id]).reduce((f,n) => f.concat(n)))
//   }

//   removeLinks (mainModel: T, mainModelIdKey: string, linksModels: Array<Model>, linkModelKey: string, linksTarget: string): Promise<any> {
//     return this.connecter.query(`
//       DELETE FROM ${linksTarget}
//       WHERE ${mainModelIdKey} = ? and
//       ${linksModels.map(v => `${linkModelKey} = ?`).join(' OR ')}
//     `, [mainModel.id, ...linksModels.map(v => v.id)])
//   }

//   createInternal (model: T, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     if (!model) {
//       return null
//     }
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       INSERT INTO ${this.target} (${model.parametersKeysSnake(fields).join(',')})
//       VALUES (${model.parametersKeys(fields).filter(v => !fields.only.length || fields.only.includes(v)).map(() => '?').join(',')})
//     `, [...model.parametersValues(fields)]).then(resp => {
//       return this.get(resp.insertId)
//     })
//   }

//   create (model: T, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     return this.createInternal(model, fields)
//   }

//   updateInternal (model: T, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     if (!model) {
//       return
//     }
//     fields = this.processFields(fields)
//     return this.connecter.query(`
//       UPDATE ${this.target}
//       SET ${model.parametersKeysSnake(new FieldsExclusive([...fields.exclude, 'id'], fields.only)).join(' = ?,')} = ?
//       WHERE id = ?
//     `, [...model.parametersValues(new FieldsExclusive([...fields.exclude, 'id'], fields.only)), model.id]).then(resp => {
//       return this.getInternal(model.id)
//     })
//   }

//   update (model: T, fields: FieldsExclusive = new FieldsExclusive()): Promise<T> {
//     return this.updateInternal(model, fields)
//   }

//   async updateAll (models: Array<T>, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     if (!models || !models.length) {
//       return []
//     }
//     fields = this.processFields(fields)
//     const params = this.model.parametersKeysSnake(fields)
//     return this.connecter.query(`
//       INSERT INTO ${this.target}
//       (${params.join(',')})
//       VALUES ${models.map(m => `(${params.map(v => '?').join(',')})`).join(',')}
//       ON DUPLICATE KEY UPDATE ${params.map(v => `${v}=VALUES(${v})`).join(',')}
//     `, models.map(v => v.parametersValues(fields)).reduce((f,n) => f.concat(n))).then(resp => {
//       return this.getAllByIds(models.map(v => v.id))
//     })
//   }

//   async createAll (models: Array<T>, fields: FieldsExclusive = new FieldsExclusive()): Promise<Array<T>> {
//     if (!models || !models.length) {
//       return []
//     }
//     fields = this.processFields(fields)
//     fields.exclude = [...fields.exclude, 'id']
//     const params = this.model.parametersKeysSnake(fields)
//     return this.connecter.query(`
//       INSERT INTO ${this.target}
//       (${params.join(',')})
//       VALUES
//       ${models.map(v => `(${params.map(v => '?').join(',')})`).toString()}
//     `, models.map(v => v.parametersValues(fields)).reduce((f,n) => f.concat(n))).then(resp => {
//       let lastId = resp.insertId
//       models = models.map(v => {
//         return {
//           ...v,
//           id: lastId++
//         }
//       })
//       return this.getAllByIds(models.map(v => v.id))
//     })
//   }

//   delete (model: T): Promise<any> {
//     if (!model || !model.id) {
//       return
//     }
//     if (this.model.hasDeleted()) {
//       return this.markOnDeletion(model)
//     }
//     return this.connecter.query(`
//       DELETE FROM ${this.target}
//       WHERE id = ?
//     `, [model.id])
//   }

//   deleteAll (models: Array<T>): Promise<any> {
//     if (this.model.hasDeleted()) {
//       return this.markOnDeletionAll(models)
//     }
//     return this.connecter.query(`
//       DELETE FROM ${this.target}
//       WHERE ${models.map(v => 'id = ?').join(' or ')}
//     `, models.map(v => v.id))
//   }

//   markOnDeletion (model: T) {
//     model.deleted = true
//     return this.updateInternal(model, new FieldsExclusive([], ['id', 'deleted']))
//   }

//   markOnDeletionAll (models: Array<T>) {
//     models = models.map(model => {
//       model.deleted = true
//       return model
//     })
//     return this.updateAll(models, new FieldsExclusive([], ['id', 'deleted']))
//   }

}
