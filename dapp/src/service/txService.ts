import { logger } from '../util/logger'
import { CreateCCTransactionDto, PostTransactionDto } from '../dto/transaction.dto'
import UserRepository from '../repository/userRepository'
import TxRepository from '../repository/txRepository'
import { getCustomRepository } from 'typeorm'
import { NotFoundError } from '../util/errors'
import sha256 from 'crypto-js/sha256'
import { invokeCreateTransaction, queryTxHashExist } from './ccService'
import Transaction from '../db/entity/Transactions'

export const postTransaction = async (payload: PostTransactionDto): Promise<Transaction> => {
  const userRepository = getCustomRepository(UserRepository)
  const txRepository = getCustomRepository(TxRepository)
  const existUser = await userRepository.getUserByIdKey(payload.idkey)
  if (!existUser) {
    throw new NotFoundError('User not found')
  }
  const currentTime = new Date()
  const messageToHash = payload.idkey + '|' + payload.amount + '|' + payload.currency_type + '|' + currentTime.valueOf()
  const hash = sha256(messageToHash).toString()

  const newTransaction = await txRepository.addTransaction({
    idkey: payload.idkey,
    amount: payload.amount,
    currency_type: payload.currency_type,
    hash: hash,
    created_at: currentTime,
  }, existUser)

  // chaincode
  const newCCUser: CreateCCTransactionDto = {
    id: existUser.id.toString(),
    idkey: existUser.idkey,
    hash: hash,
    amount: payload.amount.toString(),
    currency_type: payload.currency_type,
    created_at: currentTime.toString(),
  }
  await invokeCreateTransaction(newCCUser)

  logger.info('successfully add transaction to database')
  logger.debug(`transaction create_at: ${currentTime}`)
  return newTransaction
}

export const getTxByHash = async (hash_key: string) => {
  const txRepository = getCustomRepository(TxRepository)
  const existTransaction = await txRepository.getTxByHash(hash_key)

  // chaincode
  await queryTxHashExist(hash_key)

  if (!existTransaction) return false

  else {
    logger.info('successfully find transaction by hash')
    logger.debug(`transaction amount: ${existTransaction.amount}`)

    return true
  }
}
