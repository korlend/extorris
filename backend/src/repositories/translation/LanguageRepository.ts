import { LanguageModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class LanguageRepository extends Repository<LanguageModel> {
  constructor() {
    super(new LanguageModel());
  }
}
