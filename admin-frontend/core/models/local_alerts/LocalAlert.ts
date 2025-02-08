import type LocalAlertTypes from "./LocalAlertTypes";

export default class LocalAlert {
  uuid: string = window.crypto.randomUUID();
  title?: string;
  text: string;
  // seconds
  duration: number;
  start_date: Date = new Date();
  end_date?: Date;
  type: LocalAlertTypes;

  constructor(text: string, type: LocalAlertTypes, title?: string, duration: number = 10) {
    this.text = text;
    this.type = type;
    this.title = title;
    this.duration = duration;
    this.end_date = new Date(
      this.start_date.getTime() + this.duration * 1000
    );
  }
}
