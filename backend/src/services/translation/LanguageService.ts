import { LanguageModel } from "@src/models/db/index.js";
import LanguageRepository from "@src/repositories/translation/LanguageRepository.js";
import Service from "../Service.js";

export default class LanguageService extends Service<
  LanguageModel,
  LanguageRepository
> {
  sessionRepo = new LanguageRepository();

  constructor() {
    super(new LanguageRepository());
  }
}
