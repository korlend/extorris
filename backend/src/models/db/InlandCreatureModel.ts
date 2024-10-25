import IParsable from "@src/interfaces/IParsable.js";
import DBModel from "@src/models/db/DBModel.js";

export default class InlandCreatureModel
  extends DBModel<InlandCreatureModel>
  implements IParsable<InlandCreatureModel>
{
  [key:string]: any;

  parseObject(): InlandCreatureModel {
    const instance = new InlandCreatureModel();
    return instance;
  }
}
