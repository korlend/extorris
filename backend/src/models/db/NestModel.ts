import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class NestModel
  extends DBModel<NestModel>
  implements IParsable<NestModel>
{
  id: number = 0;
  nest_type_id: number = 0;

  parseObject(object: any): NestModel {
    const instance = new NestModel();
    instance.id = object.id;
    instance.nest_type_id = object.nest_type_id;
    return instance;
  }
}
