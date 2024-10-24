import IParsable from "@src/interfaces/IParsable.js";

export default class SearchRequestData implements IParsable<SearchRequestData> {
  from: number;
  size: number;
  sort: string; // "[key]:[direction]"
  sort_by: string; // key
  sort_direction: string; // ascending or descending

  constructor(
    from: number = 0,
    size: number = 10,
    sort: string = "id:asc",
    sort_by: string = "id",
    sort_direction: string = "asc",
  ) {
    this.from = from;
    this.size = size;
    this.sort = sort;
    this.sort_by = sort_by;
    this.sort_direction = sort_direction;
  }

  parseObject(obj: any): SearchRequestData {
    const searchRequestData = new SearchRequestData();
    searchRequestData.from = parseInt(obj.from)
      ? parseInt(obj.from.toString())
      : 0;
    searchRequestData.size = parseInt(obj.size)
      ? parseInt(obj.size.toString())
      : 10;
    searchRequestData.sort = obj.sort || "id";
    if (searchRequestData.sort) {
      const sort = searchRequestData.sort.split(":");
      searchRequestData.sort_by = sort.length ? sort[0] : "id";
      searchRequestData.sort_direction =
        sort.length > 1 && (sort[1] === "asc" || sort[1] === "desc")
          ? sort[1]
          : "asc";
    }
    return searchRequestData;
  }

  copy(): SearchRequestData {
    const srd = new SearchRequestData().parseObject(this);
    return srd;
  }
}
