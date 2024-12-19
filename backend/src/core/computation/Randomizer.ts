
export default class Randomizer {
  public static randomCheck(one: number, of: number): boolean {
    if (!one || !of || one < 0 || of < 0 || one > of) {
      return false;
    }
    const moreThan = one / of;
    const rand = Math.random();
    return moreThan < rand;
  }
}
