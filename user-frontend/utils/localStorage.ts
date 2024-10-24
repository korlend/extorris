const getItem = (name: string) => {
  const item = localStorage.getItem(name);

  if (!item) {
    return null;
  }

  return JSON.parse(item);
};

const setItem = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export { getItem, setItem };
