import FieldType from "@src/decorators/FieldType.js";
import Immutable from "@src/decorators/Immutable.js";
import { FieldTypes } from "extorris-common";
import DBModel from "@src/models/db/DBModel.js";
import EntityType from "@src/enums/EntityType.js";
import { DBModelOnlyDBData } from "@src/types/DBModelOnlyDBData.js";

export default class TreeBranchModel extends DBModel<TreeBranchModel> {
  _tableName: string = "tree_branches";
  _entityType: EntityType = EntityType.TREE_BRANCH;

  @Immutable
  @FieldType(FieldTypes.PRIMARY_KEY)
  id: number = 0;

  @FieldType(FieldTypes.ENTITY_SELECT, { fieldEntityType: EntityType.TREE })
  tree_id?: number;

  @FieldType(FieldTypes.ENTITY_SELECT, {
    fieldEntityType: EntityType.TREE_BRANCH,
  })
  previous_branch_id?: number;

  parseObject(object: DBModelOnlyDBData<TreeBranchModel>): TreeBranchModel {
    const instance = new TreeBranchModel();
    instance.id = object.id;
    instance.tree_id = object.tree_id;
    instance.previous_branch_id = object.previous_branch_id;
    return instance;
  }
}
