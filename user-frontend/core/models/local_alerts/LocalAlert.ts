import type LocalAlertTypes from "./LocalAlertTypes";
import { v4 as uuidv4 } from 'uuid';

export default class LocalAlert {
  uuid: string = uuidv4();
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
