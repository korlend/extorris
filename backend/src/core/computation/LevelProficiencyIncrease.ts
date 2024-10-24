export default class LevelProficiencyIncrease {
  public static getLevelProficiency(initial: number, percent: number, level: number) {
    return initial - initial * (percent / (level + 1) / 100);
  }
}
