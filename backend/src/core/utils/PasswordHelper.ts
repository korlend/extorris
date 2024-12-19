// const bcrypt = require('bcrypt')
import bcrypt from "bcrypt";

export default class PasswordHelper {
  static async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 7);
  }

  static async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
