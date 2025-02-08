import type ModelPropertyMetadata from "../models/ModelPropertyMetadata";

export default interface Metadata {
  [key: string]: ModelPropertyMetadata;
}
