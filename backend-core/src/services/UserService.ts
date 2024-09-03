
import UserModel from '../entities/UserModel'
import { UserRepository } from '../repositories'
import SessionModel from '../entities/SessionModel'
import PasswordReaper from '../core/tech/PasswordReaper'
import SessionService from './SessionService'
import { Service } from './'
import BaseNormalizer from '../normalizer/index/BaseNormalizer'
import FieldsExclusive from '../core/models/FieldsExclusive'
import senderHandler from '../core/tech/Mailer'

const tokenizer = require('uuid/v3')
const uuidv1 = require('uuid/v1')

export default class UserService extends Service<UserModel, UserRepository> {
  userRepo = new UserRepository()
  sessionService = new SessionService()

  constructor () {
    super(new UserRepository(), 'users', new BaseNormalizer())
  }

  async checkUserPassword (user: UserModel, password: string) {
    return user.password === password || await PasswordReaper.checkPassword(password, user.password)
  }

  async login (email: string, password: string): Promise<SessionModel> {
    let user = await this.userRepo.getByEmail(email)
    if (!user) {
      return null
    }
    if (!await this.checkUserPassword(user, password)) {
      this.userRepo.incrementPasswordAttempts(user)
      return null
    }
    if (!user.approved) {
      return null
    }
    return await this.sessionService.createSession(user.id)
  }

  async logout (session: SessionModel) {
    return this.sessionService.reduceSession(session)
  }

  async getUserByEmail(email:string) {
    return await this.userRepo.getUserByEmail(email)
  }

  async findDeletedUser(email:string): Promise<UserModel> {
    return await this.userRepo.getDeletedUser(email)
  }

  async register (user: UserModel, frontendUrl:string = '') {
    let existsMsg = ''
    let newUser = null
    const isUserExsist = await this.getUserByEmail(user.email)
    if (isUserExsist) {
      existsMsg = 'User already exists'
    } else {
      const deletedUser = await this.findDeletedUser(user.email)
      if (deletedUser) {
        user.id = deletedUser.id
        newUser = await this.updateUser(user, false)
      } else {
        newUser = await this.createUser(user)
      }
      await senderHandler(newUser, 'newUser', frontendUrl)
    }
    return {newUser, existsMsg}
  }


  async restorePassword(user: UserModel, frontendUrl:string = ''): Promise<string> {
    const token = await this.setRestoreToken(user)
    if (!token) return null
    user.restore_token = token
    await senderHandler(user, 'restore', frontendUrl)
    return token
  }

  async setRestoreToken(user: UserModel): Promise<string> {
    user.restore_token = tokenizer(user.email, uuidv1())
    await this.userRepo.updateUser(user)
    return user.restore_token
  }

  async checkUserToken(email:string, token:string): Promise<string> {
    const user = await this.userRepo.getUserByEmail(email)
    if (!user) return null
    if (user.restore_token !== token) return null
    return user.email
  }

  async changeUserPassword(userInfo:any): Promise<UserModel> {
    const user = await this.userRepo.getByEmail(userInfo.email)
    if (!user) return null
    user.password = userInfo.password
    await senderHandler(user, 'passwordChanged')
    user.password = await PasswordReaper.encryptPassword(userInfo.password)
    user.password_changed_at = new Date()
    user.restore_token = null
    return await this.userRepo.updateUser(user)
  }

  async getUser (id: number): Promise<UserModel> {
    return await this.userRepo.getUserWithoutPass(id)
  }

  async getUserBySessionToken (token: string): Promise<UserModel> {
    return await this.userRepo.getBySessionToken(token)
  }

  async getUsers (): Promise<Array<UserModel>> {
    return await this.userRepo.getAllUsersWithoutPass()
  }

  async createUser (user: UserModel): Promise<UserModel> {
    return await this.userRepo.create(user)
  }

  async updateUser (user: UserModel, checkPassword: boolean = true): Promise<UserModel> {
    if (checkPassword) {
      await senderHandler(user, 'passwordChanged')
      user.password = await PasswordReaper.encryptPassword(user.password)
    }
    return await this.userRepo.updateUser(user)
  }

  async notifyApprove(user: UserModel, action: string, frontendUrl:string = '') {
    if (action === 'approve') {
      user = await this.userRepo.getByEmail(user.email)
      await senderHandler(user, action, frontendUrl)
      user.password = await PasswordReaper.encryptPassword(user.password)
      await this.userRepo.updateUser(user)
    } else {
      await senderHandler(user, action)
    }
    return user
  }

  async getTotal (mallId: number): Promise<number> {
    return await this.userRepo.getTotal(mallId)
  }

  async getUsersByMallId (from: number = 0, pageSize: number = 10, mallId: number, fieldsExclude: FieldsExclusive = new FieldsExclusive()): Promise<UserModel> {
    return await this.userRepo.getUsersByMallId(from, pageSize, mallId, fieldsExclude)
  }

  async getAllNotApprovedUsersAndAdmin (fieldsExclude: FieldsExclusive = new FieldsExclusive()): Promise<UserModel> {
    return await this.userRepo.getAllNotApprovedUsersAndAdmin(fieldsExclude)
  }
}
