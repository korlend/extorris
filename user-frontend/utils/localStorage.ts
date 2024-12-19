const getLocalStorageItem = (name: string): any => {
  const item = localStorage.getItem(name);

  if (!item) {
    return null;
  }

  return item;
};

const setLocalStorageItem = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export { getLocalStorageItem, setLocalStorageItem };
