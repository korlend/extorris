export default class SearchRequestData {
  from: number;
  size: number;
  sort_by: string; // key
  sort_direction: string; // ascending or descending

  constructor(
    from: number = 0,
    size: number = 10,
    sort_by: string = "id",
    sort_direction: string = "asc",
  ) {
    this.from = from;
    this.size = size;
    this.sort_by = sort_by;
    this.sort_direction = sort_direction === "desc" ? "desc" : "asc";
  }
}
