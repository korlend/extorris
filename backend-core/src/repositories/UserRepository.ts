export default class UserRepository extends Repository<UserModel> {
  userModel = new UserModel()
  sessionRepo = new SessionRepository()

  constructor () {
    super(new UserModel(), 'users')
  }
}
/*

import UserModel from '../entities/UserModel'
import { Repository, SessionRepository } from '.'
import FieldsExclusive from '../core/models/FieldsExclusive'

const config = require('config')

export default class UserRepository extends Repository<UserModel> {
  userModel = new UserModel()
  sessionRepo = new SessionRepository()

  constructor () {
    super(new UserModel(), 'users')
  }

  getUserPassword (id: number): Promise<string> {
    return this.connecter.query(`
      select * from ${this.target}
      where id = ?
      ${this.defaultFilters()}
    `, [id]).then(resp => this.modelFromDataPacket(resp)
      .then(userModel => userModel.password))
  }

  getByEmail (email: string): Promise<UserModel> {
    return this.connecter.query(`
      select * from ${this.target}
      where email = ?
      ${this.defaultFilters()}
    `, [email]).then(resp => this.modelFromDataPacket(resp))
  }

  getUserByEmail (email:string) {
    return this.getBy('email', email, new FieldsExclusive(['password']))
  }

  getDeletedUser (email:string): Promise<UserModel> {
    return this.connecter.query(`
      select * from ${this.target}
      where email = ?
      and deleted = 1
    `, [email]).then(resp => this.modelFromDataPacket(resp))
  }

  getByFirstname (firstname: string): Promise<UserModel> {
    return this.connecter.query(`
      select * from ${this.target}
      where firstname = ?
      ${this.defaultFilters()}
    `, [firstname]).then(resp => this.modelFromDataPacket(resp))
  }

  getBySessionToken (token: string): Promise<UserModel> {
    return this.connecter.query(`
      select u.* from ${this.target} u
      left join ${this.sessionRepo.target} s on u.id = s.user_id
      where s.token = ?
      ${this.defaultFilters('u')}
    `, [token]).then(resp => this.modelFromDataPacket(resp))
  }

  incrementPasswordAttempts (user: UserModel) {
    this.connecter.query(`
      UPDATE ${this.target}
      SET login_attempts = login_attempts + 1
      WHERE id = ?
    `, [user.id])
  }

  updateUser(user: UserModel) {
    return this.updateInternal(user, new FieldsExclusive([], [], ['password']))
  }

  getUserWithoutPass(id: number) {
    return this.getInternal(id, new FieldsExclusive(['password']))
  }

  getAllUsersWithoutPass()  {
    return this.getAllInternal(0, 0, new FieldsExclusive(['password']))
  }

  removeSessions(userId: number) {
    this.connecter.query(`
      DELETE FROM ${this.scheme}.sessions
      WHERE user_id = ?
    `, [userId])
  }

  getTotal(mallId: number): Promise<number> {
    return this.connecter.query(`
      select count(*) from ${this.target}
      ${mallId ? `where mall_id = ${mallId} ${this.defaultFilters()}` : 'where deleted = 0 or deleted is null'}
    `).then(resp => {
      if (resp && resp.length) {
        resp = resp[0]
        return resp['count(*)']
      }
      return 0
    })
  }

  getUsersByMallId(from: number = 0, pageSize: number = 10, mallId: number, fieldsExclude: FieldsExclusive = new FieldsExclusive()): Promise<UserModel> {
    return this.connecter.query(`
      select ${this.userModel.parametersKeysSnake(fieldsExclude).join(',')} from ${this.target}
      where id is not null
      ${this.defaultFilters()}
      ${mallId ? `and mall_id = ${mallId}` : ''}
      ${pageSize ? `limit ${from},${pageSize}` : ''}
    `).then(resp => {
      if (resp && resp.length) {
        return resp
      }
      return []
    })
  }

  getAllNotApprovedUsersAndAdmin(fieldsExclude: FieldsExclusive = new FieldsExclusive()): Promise<UserModel> {
    return this.connecter.query(`
      select ${this.userModel.parametersKeysSnake(fieldsExclude).join(',')} from ${this.target}
      where id is not null
      ${this.defaultFilters()}
      and approved = 0
      or email = 'admin@admin.admin'
    `).then(resp => {
      if (resp && resp.length) {
        return resp
      }
      return []
    })
  }

}
*/
