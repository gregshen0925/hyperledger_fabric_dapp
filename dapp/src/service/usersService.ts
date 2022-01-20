import { logger } from '../util/logger'
import {
  CreateUserDto,
  UpdateUserDto,
  CreateCCUserDto,
  UpdateCCUserDto,
} from '../dto/users.dto'
import UserRepository from '../repository/userRepository'
import { getCustomRepository } from 'typeorm'
import { NotFoundError, ForbiddenError } from '../util/errors'
import {
  invokeCreateUser, invokeUpdateUser, queryGetUserList, queryGetUserAndTxById,
} from './ccService'
import Users from '../db/entity/Users'

export const createUser = async (payload: CreateUserDto): Promise<Users> => {
  const userRepository = getCustomRepository(UserRepository)

  const existUser = await userRepository.getUserByIdKey(payload.idkey)
  if (existUser) {
    throw new ForbiddenError('User already exist')
  }

  const userToCreate = await userRepository.createUser(payload)

  const createCCUser: CreateCCUserDto = {
    id: userToCreate.id.toString(),
    idkey: userToCreate.idkey,
    name: userToCreate.name,
    email: userToCreate.email,
  }
  await invokeCreateUser(createCCUser)

  logger.info('Create user success')
  logger.debug(`User email: ${payload.email}`)

  return userToCreate
}

export const getUserList = async () => {
  const userRepository = getCustomRepository(UserRepository)

  const users = await userRepository.getUserList()
  const bcUser = await queryGetUserList()
  logger.info('Get user list success')
  return {
    users: users,
    blockchain_user: bcUser,
  }
}

export const getUserById = async (id: number) => {
  const userRepository = getCustomRepository(UserRepository)

  const user = await userRepository.getUserById(id)
  if (!user) {
    throw new NotFoundError('User is not Found')
  }
  const bcUserAndTX = await queryGetUserAndTxById(id.toString())

  logger.info('Get user info by id success')
  logger.debug(`User email: ${user.email}`)

  return {
    user: user,
    blockchain_user: bcUserAndTX,
  }
}

export const getUserByIdKey = async (idkey: string) => {
  const userRepository = getCustomRepository(UserRepository)

  const user = await userRepository.getUserByIdKey(idkey)
  if (!user) {
    throw new NotFoundError('User is not Found')
  }

  logger.info('Get user info by idkey success')
  logger.debug(`User email: ${user.email}`)

  return user
}

export const updateUserById = async (payload: UpdateUserDto): Promise<Users> => {
  const userRepository = getCustomRepository(UserRepository)

  const existUser = await userRepository.getUserById(payload.id)
  if (!existUser) {
    throw new NotFoundError('User is not Found')
  }

  const updateUser = await userRepository.updateUser(payload, existUser)

  // chaincode
  const updateCCUser: UpdateCCUserDto = {
    id: updateUser.id.toString(),
    idkey: updateUser.idkey,
    name: updateUser.name,
    email: updateUser.email,
  }
  await invokeUpdateUser(updateCCUser)

  logger.info('update user by id success')
  logger.debug(`User email: ${existUser.email}`)

  return updateUser
}
