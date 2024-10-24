import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class MainMapModel
  extends DBModel<MainMapModel>
  implements IParsable<MainMapModel>
{
  id: number = 0;
  created: Date | null = new Date();
  updated: Date | null = new Date();
  iteration_id: number = 0;
  layer: number = 0;

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): MainMapModel {
    const instance = new MainMapModel();
    instance.id = object.id;
    // instance.created = object.created ? new Date(object.created) : null;
    // instance.updated = object.updated ? new Date(object.updated) : null;
    instance.iteration_id = object.iteration_id;
    instance.layer = object.layer;
    return instance;
  }
}
