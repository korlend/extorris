import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class IterationModel
  extends DBModel<IterationModel>
  implements IParsable<IterationModel>
{
  id: number = 0;
  created: Date | null = new Date();
  updated: Date | null = new Date();
  start_date: Date | null = new Date();
  end_date: Date | null = new Date();

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): IterationModel {
    const instance = new IterationModel();
    instance.id = object.id;
    instance.created = object.created ? new Date(object.created) : null;
    instance.updated = object.updated ? new Date(object.updated) : null;
    instance.start_date = object.start_date ? new Date(object.start_date) : null;
    instance.end_date = object.end_date ? new Date(object.end_date) : null;
    return instance;
  }
}
