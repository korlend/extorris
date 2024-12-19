import { GuildModel } from "@src/models/db/index.js";
import Repository from "./Repository.js";

export default class GuildRepository extends Repository<GuildModel> {
  constructor() {
    super(new GuildModel());
  }
}
