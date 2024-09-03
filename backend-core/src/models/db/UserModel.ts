import DBModel from "src/interfaces/DBModel";

export default class UserModel implements DBModel<UserModel> {

  id: Number = 0;
  nickname: String = '';
  email: String = '';
  firstname: String = '';
  surname: String = '';
  phone: String = '';

  parseObject(object: any): UserModel {
    this.id = object.id;
    this.nickname = object.nickname;
    this.email = object.email;
    this.firstname = object.firstname;
    this.surname = object.surname;
    this.phone = object.phone;
    return this;
  }
}
