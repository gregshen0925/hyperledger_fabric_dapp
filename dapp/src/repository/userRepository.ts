import { EntityRepository, Repository } from 'typeorm'
import Users from '../db/entity/Users'

import {
  CreateUserDto,
  UpdateUserDto,
} from '../dto/users.dto'

@EntityRepository(Users)
export default class UserRepository extends Repository<Users> {
  public async createUser (payload: CreateUserDto) {
    const newUser = this.create()
    newUser.name = payload.name
    newUser.email = payload.email
    newUser.idkey = payload.idkey

    return this.save(newUser)
  }

  public async getUserList () {
    const users = await Users.find({
      select: ['id', 'name', 'email', 'idkey'],
    })
    return users
  }

  public async getUserById (id: number) {
    const existUser = await Users.findOne(id, {
      select: ['id', 'name', 'email', 'idkey'],
      relations: ['transactions'],
    })
    return existUser
  }

  public async getUserByIdKey (idkey: string) {
    const existUser = await Users.findOne({
      where: { idkey },
    })
    return existUser
  }

  public async updateUser (payload: UpdateUserDto, user: Users) {
    user.name = payload.name ? payload.name : user.name
    user.email = payload.email ? payload.email : user.email
    user.idkey = payload.idkey ? payload.idkey : user.idkey

    return this.save(user)
  }
}
