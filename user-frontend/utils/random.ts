export function getRandomInt(max: number) {
  return Math.round(Math.random() * max);
};

export function getColor() {
  return {
    r: getRandomInt(256),
    g: getRandomInt(256),
    b: getRandomInt(256),
  };
};
