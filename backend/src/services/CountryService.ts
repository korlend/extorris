import CountryModel from "@src/models/db/CountryModel.js";
import CountryRepository from "@src/repositories/CountryRepository.js";
import Service from "./Service.js";

export default class CountryService extends Service<
  CountryModel,
  CountryRepository
> {
  sessionRepo = new CountryRepository();

  constructor() {
    super(new CountryRepository());
  }
}
