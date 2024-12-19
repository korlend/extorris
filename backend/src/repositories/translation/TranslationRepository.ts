import { TranslationModel } from "@src/models/db/index.js";
import Repository from "../Repository.js";

export default class TranslationRepository extends Repository<TranslationModel> {
  constructor() {
    super(new TranslationModel());
  }
}
