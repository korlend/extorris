import ImageModel from "@src/models/db/ImageModel.js";
import ImageRepository from "@src/repositories/ImageRepository.js";
import Service from "./Service.js";

export default class ImageService extends Service<
  ImageModel,
  ImageRepository
> {
  constructor() {
    super(new ImageRepository());
  }
}
