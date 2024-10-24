import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class MainMapHubModel
  extends DBModel<MainMapHubModel>
  implements IParsable<MainMapHubModel>
{
  id: number = 0;
  main_map_id: number = 0;
  created: Date | null = new Date();
  updated: Date | null = new Date();
  contamination_level: number = 0;
  internal_depth: number = 0;

  _immutables = ["id", "created", "updated"];

  parseObject(object: any): MainMapHubModel {
    const instance = new MainMapHubModel();
    instance.id = object.id;
    instance.main_map_id = object.main_map_id;
    // instance.created = object.created ? new Date(object.created) : null;
    // instance.updated = object.updated ? new Date(object.updated) : null;
    instance.contamination_level = object.contamination_level;
    instance.internal_depth = object.internal_depth;
    return instance;
  }
}
