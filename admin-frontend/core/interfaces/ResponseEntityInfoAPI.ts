import type ModelPropertyMetadata from "./ModelPropertyMetadata";

export default interface ResponseEntityInfoAPI {
  keys: Array<string>;
  keysMetadata: Record<string, ModelPropertyMetadata>;
}
