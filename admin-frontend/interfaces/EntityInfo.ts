export default interface EntityInfo {
  name: string;
  type: "string" | "int" | "float" | "Date" | "select";
  immutable: boolean;
  values?: Array<string>; // when type select
}
