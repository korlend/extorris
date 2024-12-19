

export default class DateUtils {
  static getBeginningOfNextMonth(date?: Date): Date {
    if (!date) {
      date = new Date();
    }
    const nextMonth = date.getMonth() + 1;
    date.setMonth(nextMonth > 12 ? 1 : nextMonth);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
