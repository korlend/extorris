/**
 * chance of one out of
 * @one one
 * @of of
 */
export function randomCheck(one: number, of: number): boolean {
  if (!one || !of || one < 0 || of < 0 || one > of) {
    return false;
  }
  const moreThan = one / of;
  const rand = Math.random();
  return moreThan > rand;
}

/**
 * returns random int where result x is [0 >= x <= max]
 * @max maximum
 */
export function randomInt(max: number = 1): number {
  const rand = Math.floor(Math.random() * max);
  return rand;
}
