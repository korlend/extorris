import DBFilter from "@src/models/DBFilter.js";

export default class DBFilterBuilder {
  public query: string;
  public values: Array<any>;

  constructor(filters?: Array<DBFilter>) {
    this.query = this.buildQuery(filters);
    this.values = this.buildValues(filters);
  }

  private buildQuery(filters?: Array<DBFilter>): string {
    if (!filters || !filters.length) {
      return "";
    }

    let finalString: string = "and ";
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      finalString += `?? ${filter.operand} ?`;
      if (i !== filters.length - 1) {
        finalString += ` ${filter.logical} `;
      }
    }
    return finalString;
  }

  private buildValues(filters?: Array<DBFilter>): Array<any> {
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
