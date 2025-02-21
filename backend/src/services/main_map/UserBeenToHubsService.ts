import { UserBeenToHubsModel, UserModel } from "@src/models/db/index.js";
import UserBeenToHubsRepository from "@src/repositories/main_map/UserBeenToHubsRepository.js";
import Service from "../Service.js";
import DBFilter from "@src/models/DBFilter.js";

export default class UserBeenToHubsService extends Service<
  UserBeenToHubsModel,
  UserBeenToHubsRepository
> {
  constructor() {
    super(new UserBeenToHubsRepository());
  }

  async addUserBeenToHub(
    userId: number,
    hubId: number,
  ): Promise<UserBeenToHubsModel> {
    const filters: Array<DBFilter<UserBeenToHubsModel>> = [];
    filters.push(new DBFilter("hub_id", hubId));
    filters.push(new DBFilter("user_id", userId));
    const existingLink = await this.getSearchSingle(filters);

    if (existingLink) {
      return existingLink;
    }
    const newUserBeenHubLink = new UserBeenToHubsModel();
    newUserBeenHubLink.hub_id = hubId;
    newUserBeenHubLink.user_id = userId;
    return this.create(newUserBeenHubLink);
  }

  async isUserBeenToHub(userId: number, hubId: number) {
    const filters: Array<DBFilter<UserBeenToHubsModel>> = [];
    filters.push(new DBFilter("user_id", userId))
    filters.push(new DBFilter("hub_id", hubId))
    const response = await this.getSearchSingle(filters);
    return !!response;
  }
}
