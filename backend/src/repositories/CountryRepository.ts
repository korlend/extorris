import { CountryModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class CountryRepository extends Repository<CountryModel> {
  constructor() {
    super(new CountryModel());
  }
}
