export default interface ResponseAPI<T = any> {
  status: number;
  result: T;
  description?: string;
}
