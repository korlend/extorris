import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import EntityType from "@src/enums/EntityType.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class ImageModel extends DBModel<ImageModel> {
  _tableName: string = "images";
  _entityType: EntityType = EntityType.IMAGE;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.IMAGE_PATH)
  relative_path: string = "";

  @FieldType(FieldTypes.STRING)
  name?: string;

  @FieldType(FieldTypes.INT)
  width?: number;

  @FieldType(FieldTypes.INT)
  height?: number;

  @FieldType(FieldTypes.BOOLEAN)
  is_temp?: boolean = false;

  @FieldType(FieldTypes.INT)
  size?: number;

  parseObject(object: DBModelOnlyDBData<ImageModel>): ImageModel {
    const instance = new ImageModel();
    instance.id = object.id;
    instance.relative_path = object.relative_path;
    instance.name = object.name;
    instance.width = object.width;
    instance.height = object.height;
    instance.is_temp = object.is_temp;
    instance.size = object.size;
    return instance;
  }
}
