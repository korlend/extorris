import { TranslationModel } from "@src/models/db/index.js";
import TranslationRepository from "@src/repositories/translation/TranslationRepository.js";
import Service from "../Service.js";

export default class TranslationService extends Service<
  TranslationModel,
  TranslationRepository
> {
  constructor() {
    super(new TranslationRepository());
  }
}
