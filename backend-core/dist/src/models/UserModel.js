"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    id = 0;
    nickname = '';
    email = '';
    firstname = '';
    surname = '';
    phone = '';
    createFromObject(object) {
        let userModel = new UserModel();
        userModel.id = object.id;
        userModel.nickname = object.nickname;
        userModel.email = object.email;
        userModel.firstname = object.firstname;
        userModel.surname = object.surname;
        userModel.phone = object.phone;
        return userModel;
    }
}
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map