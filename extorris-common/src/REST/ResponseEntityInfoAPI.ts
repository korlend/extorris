import ModelPropertyMetadata from "src/models/ModelPropertyMetadata";

export default interface ResponseEntityInfoAPI {
  keys: Array<string>;
  keysMetadata: Record<string, ModelPropertyMetadata>;
}
