import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class DummyModel
  extends DBModel<DummyModel>
  implements IParsable<DummyModel>
{
  [key:string]: any;

  parseObject(): DummyModel {
    const instance = new DummyModel();
    return instance;
  }
}
