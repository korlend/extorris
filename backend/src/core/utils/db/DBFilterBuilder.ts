import DBModel from "@src/models/db/DBModel.js";
import DBFilter from "@src/models/DBFilter.js";

export default class DBFilterBuilder<T extends DBModel<T>> {
  public query: string;
  public values: Array<any>;

  constructor(filters?: Array<DBFilter<T>>) {
    this.query = this.buildQuery(filters);
    this.values = this.buildValues(filters);
  }

  private buildQuery(filters?: Array<DBFilter<T>>): string {
    if (!filters || !filters.length) {
      return "";
    }

    let finalString: string = "and ";
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.section === "OPEN") {
        finalString += "("
      }
      finalString += `?? ${filter.operand} ?`;
      if (filter.section === "CLOSE") {
        finalString += ")"
      }
      if (i !== filters.length - 1) {
        finalString += ` ${filter.logical} `;
      }
    }
    return finalString;
  }

  private buildValues(filters?: Array<DBFilter<T>>): Array<any> {
    if (!filters || !filters.length) {
      return [];
    }

    const values: Array<any> = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      values.push(filter.name);
      values.push(filter.value);
    }
    return values;
  }
}
