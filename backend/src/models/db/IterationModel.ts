import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import FieldTypes from "@src/enums/FieldTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class IterationModel extends DBModel<IterationModel> {
  _tableName: string = "iterations";
  _entityType: EntityType = EntityType.ITERATION;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @Immutable
  @FieldType(FieldTypes.DATE)
  created?: Date = new Date();

  @Immutable
  @FieldType(FieldTypes.DATE)
  updated?: Date = new Date();

  @FieldType(FieldTypes.DATE)
  start_date?: Date = new Date();

  @FieldType(FieldTypes.DATE)
  end_date?: Date = new Date();

  @FieldType(FieldTypes.BOOLEAN)
  active: boolean = false;

  parseObject(object: DBModelOnlyDBData<IterationModel>): IterationModel {
    const instance = new IterationModel();
    instance.id = object.id;
    instance.created = object.created ? new Date(object.created) : undefined;
    instance.updated = object.updated ? new Date(object.updated) : undefined;
    instance.start_date = object.start_date
      ? new Date(object.start_date)
      : undefined;
    instance.end_date = object.end_date ? new Date(object.end_date) : undefined;
    instance.active = !!object.active;
    return instance;
  }
}
