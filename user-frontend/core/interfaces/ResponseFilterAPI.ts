export default interface ResponseFilterAPI<T = any> {
  items: Array<T>;
  total: number;
}
