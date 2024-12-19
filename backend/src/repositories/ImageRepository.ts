import { ImageModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class ImageRepository extends Repository<ImageModel> {
  constructor() {
    super(new ImageModel());
  }
}
