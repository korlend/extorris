import { TranslationLanguageModel } from "@src/models/db/index.js";
import TranslationLanguageRepository from "@src/repositories/translation/TranslationLanguageRepository.js";
import Service from "../Service.js";

export default class TranslationLanguageService extends Service<
  TranslationLanguageModel,
  TranslationLanguageRepository
> {
  sessionRepo = new TranslationLanguageRepository();

  constructor() {
    super(new TranslationLanguageRepository());
  }
}
