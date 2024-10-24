import IterationModel from "@src/models/db/IterationModel.js";
import IterationRepository from "@src/repositories/IterationRepository.js";
import Service from "./Service.js";

export default class IterationService extends Service<
  IterationModel,
  IterationRepository
> {
  sessionRepo = new IterationRepository();

  constructor() {
    super(new IterationRepository());
  }

  generateIteration(iterationNumber: number, startDate: Date, endDate: Date) {

  }
}
