import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class NestTypeModel
  extends DBModel<NestTypeModel>
  implements IParsable<NestTypeModel>
{
  id: number = 0;
  creature_id: number = 0;

  parseObject(object: any): NestTypeModel {
    const instance = new NestTypeModel();
    instance.id = object.id;
    instance.creature_id = object.creature_id;
    return instance;
  }
}
