import FabricClient from '../FabricClient'
import { logger } from '../util/logger'
import { ChaincodeError } from '../util/errors'
import {
  CreateCCUserDto,
  UpdateCCUserDto,
} from '../dto/users.dto'
import {
  CreateCCTransactionDto,
} from '../dto/transaction.dto'

const invokeResult = (result: [] | null) => {
  if (result === null) {
    throw new ChaincodeError('There is no response from chaincode: invoke')
  } else {
    logger.info('invoke success')
    return true
  }
}

const queryResult = (result: [] | null) => {
  if (result === null) {
    throw new ChaincodeError('There is no response from chaincode: query')
  } else {
    logger.info('query success')
    return result
  }
}

export const invokeCreateUser = async (payload: CreateCCUserDto) => {
  logger.info('FabricClient invoke: CreateUser')
  const result = await FabricClient.invokeChaincode(
    'CreateUser',
    [JSON.stringify(payload)],
  )
  return invokeResult(result)
}

export const queryGetUserList = async () => {
  logger.info('FabricClient query: GetUserList')
  const result = await FabricClient.queryChaincode(
    'GetUserList',
    [],
  )
  return queryResult(result)
}

export const invokeUpdateUser = async (payload: UpdateCCUserDto) => {
  logger.info('FabricClient invoke: UpdateUser')
  const result = await FabricClient.invokeChaincode(
    'UpdateUser',
    [JSON.stringify(payload)],
  )
  return invokeResult(result)
}

export const invokeCreateTransaction = async (payload: CreateCCTransactionDto) => {
  logger.info('FabricClient invoke: CreateTransaction')
  const result = await FabricClient.invokeChaincode(
    'CreateTransaction',
    [JSON.stringify(payload)],
  )
  return invokeResult(result)
}

export const queryTxHashExist = async (hash: string) => {
  logger.info('FabricClient invoke "TxHashExist" success')
  const result = await FabricClient.queryChaincode(
    'TxHashExist',
    [hash],
  )
  return queryResult(result)
}

export const queryGetUserAndTxById = async (id: string) => {
  logger.info('FabricClient query "GetUserAndTxByID" success')
  const results = await FabricClient.queryChaincode(
    'GetUserAndTxById',
    [id],
  )
  return queryResult(results)
}
