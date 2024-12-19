export function getItemLabel(item: Record<string, any>) {
  if (!item) {
    return '';
  }
  if (item.username) {
    return `${item.id} - ${item.username}`;
  }
  if (item.name) {
    return `${item.id} - ${item.name}`;
  }
  if (item.code) {
    return `${item.id} - ${item.code}`;
  }
  if (item.code_name) {
    return `${item.id} - ${item.code_name}`;
  }
  return `${item.id}`;
};
