import { TranslationLanguageModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class TranslationLanguageRepository extends Repository<TranslationLanguageModel> {
  constructor() {
    super(new TranslationLanguageModel());
  }
}
