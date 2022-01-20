// global describe, it, before, after, beforeEach, afterEach

import assert from 'assert'

import {
  clearTables,
  clearDatabase,
  closeDatabase,
  initDatabase,
} from '../ormconfig'

import { createUser } from '../../src/service/usersService'
import { postTransaction, getTxByHash } from '../../src/service/txService'
import { NotFoundError } from '../../src/util/errors'
import FabricClient from '../../src/FabricClient'
import sinon from 'sinon'

const testUser1 = {
  name: 'testUser1',
  email: 'testUser1@test.com',
  idkey: 'A123456789',
}

const testTransaction = {
  idkey: 'A123456789',
  amount: 100.1,
  currency_type: 'USD',
}
let stubInvoke: any

describe('txService.test.ts', () => {
  before(async () => {
    await initDatabase()
  })

  after(async () => {
    await clearDatabase()
    await closeDatabase()
  })

  beforeEach(() => {
    // runs before each test in this block
    stubInvoke = sinon.stub(FabricClient, 'invokeChaincode').resolves(true)
  })

  afterEach(async () => {
    await clearTables()
    stubInvoke.restore()
  })

  console.log(testTransaction.idkey)

  describe('postTransaction', () => {
    it('should return Error when get not exist user', async () => {
      await assert.rejects(async () => { await postTransaction(testTransaction) }, NotFoundError)
    })

    it('should return true when add transaction is success', async () => {
      const whichUser = await createUser(testUser1)
      const newTransaction = await postTransaction(testTransaction)

      assert.strictEqual(newTransaction.amount, testTransaction.amount)
      assert.strictEqual(newTransaction.currency_type, testTransaction.currency_type)
      assert.strictEqual(newTransaction.user.idkey, whichUser.idkey)
    })
  })

  describe('getTxByHash', () => {
    it('should return false when the transaction is not exist', async () => {
      const testFuncTransaction = await getTxByHash('f93olmn234')

      assert.strictEqual(false, testFuncTransaction)
    })

    it('should return true when call getTransactionExist', async () => {
      await createUser(testUser1)
      const newTransaction = await postTransaction(testTransaction)

      const testFuncTransaction = await getTxByHash(newTransaction.hash)

      assert.strictEqual(true, testFuncTransaction)
    })
  })
})
