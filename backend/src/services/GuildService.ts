import GuildModel from "@src/models/db/GuildModel.js";
import GuildRepository from "@src/repositories/GuildRepository.js";
import Service from "./Service.js";

export default class GuildService extends Service<
  GuildModel,
  GuildRepository
> {
  sessionRepo = new GuildRepository();

  constructor() {
    super(new GuildRepository());
  }
}
