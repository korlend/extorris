export function getItemLabel(item: Record<string, any>) {
  let internalItem = deepToRaw(item);
  if (!internalItem) {
    return "";
  }
  if (internalItem.username) {
    return `${internalItem.id} - ${internalItem.username}`;
  }
  if (internalItem.name) {
    return `${internalItem.id} - ${internalItem.name}`;
  }
  if (internalItem.code) {
    return `${internalItem.id} - ${internalItem.code}`;
  }
  if (internalItem.code_name) {
    return `${internalItem.id} - ${internalItem.code_name}`;
  }
  return `${internalItem.id}`;
}
