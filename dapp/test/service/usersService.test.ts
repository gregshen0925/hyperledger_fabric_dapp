// global describe, it, before, after, beforeEach, afterEach
import assert from 'assert'

import {
  clearTables,
  clearDatabase,
  closeDatabase,
  initDatabase,
} from '../ormconfig'

import {
  createUser,
  getUserList,
  getUserById,
  updateUserById,
  getUserByIdKey,
} from '../../src/service/usersService'
import { postTransaction } from '../../src/service/txService'

import Users from '../../src/db/entity/Users'
import { ForbiddenError, NotFoundError } from '../../src/util/errors'
import UserRepository from '../../src/repository/userRepository'
import { getCustomRepository } from 'typeorm'
import FabricClient from '../../src/FabricClient'
import sinon from 'sinon'

const testUser1 = {
  name: 'testUser1',
  email: 'testUser1@test.com',
  idkey: 'A123456781',
}

const testUser2 = {
  name: 'testUser2',
  email: 'testUser2@test.com',
  idkey: 'A123456782',
}

const testUser3 = {
  name: 'testUser3',
  email: 'testUser3@test.com',
  idkey: 'A123456783',
}

const testUser4 = {
  name: 'testUser4',
  email: 'testUser4@test.com',
  idkey: 'A123456784',
}

const testUser5 = {
  id: 1,
  name: 'testUser5',
  email: 'testUser5@test.com',
  idkey: 'A123456785',
  is_admin: true,
}

const transaction1 = {
  idkey: 'A123456784',
  amount: 5.45,
  currency_type: 'USD',

}
let stubInvoke: any
let stubQuery: any

describe('usersService.test.ts', () => {
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

  describe('createUser', () => {
    it('should return true when insert is success and user is admin', async () => {
      const user = await createUser(testUser1)

      assert.strictEqual(user.name, testUser1.name)
      assert.strictEqual(user.email, testUser1.email)
      assert.strictEqual(user.idkey, testUser1.idkey)
    })

    it('should return Error when insert same user', async () => {
      await createUser(testUser1)
      await assert.rejects(async () => { await createUser(testUser1) }, ForbiddenError)
    })
  })

  describe('getUserList', () => {
    it('should return array and length equal createUser number', async () => {
      stubQuery = sinon.stub(FabricClient, 'queryChaincode').resolves([
        testUser1,
        testUser3,
      ])

      await createUser(testUser1)
      await createUser(testUser2)
      await createUser(testUser3)

      const userRepository = getCustomRepository(UserRepository)
      const testUser2DB = await userRepository.getUserByIdKey(testUser2.idkey)
      if (testUser2DB) {
        await userRepository.softRemove(testUser2DB)
      }

      const users = await getUserList()

      assert.strictEqual(typeof users, 'object')
      assert.strictEqual(users.users.length, 2)

      stubQuery.restore()
    })
  })

  describe('getUserById', () => {
    it('should return Error when get not exist user', async () => {
      await assert.rejects(async () => { await getUserById(1) }, NotFoundError)
    })

    it('should return same user data when call function getUserById', async () => {
      await createUser(testUser4)
      const testUser4DB = await Users.findOneOrFail({ where: { email: testUser4.email } })

      const testTx = await postTransaction(transaction1)
      const testFuncUser4DB = await getUserById(testUser4DB.id)

      const chaincodeData = [
        {
          testUser4,
          transaction: [
            {
              create_at: testTx.created_at,
              hash: testTx.hash,
              amount: testTx.amount,
              currency_type: testTx.currency_type,
            },
          ],
        },
      ]
      stubQuery = sinon.stub(FabricClient, 'queryChaincode').resolves(chaincodeData)

      assert.strictEqual(testFuncUser4DB.user.name, testUser4.name)
      assert.strictEqual(testFuncUser4DB.user.email, testUser4.email)
      assert.strictEqual(testFuncUser4DB.user.idkey, testUser4.idkey)

      stubQuery.restore()
    })
  })

  describe('getUserByIdKey', () => {
    it('should return Error when get not exist user', async () => {
      await assert.rejects(async () => { await getUserByIdKey('grwefwegt') }, NotFoundError)
    })

    it('should return same user data when call function getUserById', async () => {
      await createUser(testUser4)
      const testUser4DB = await Users.findOneOrFail({ where: { email: testUser4.email } })

      const testFuncUser4DB = await getUserByIdKey(testUser4DB.idkey)

      assert.strictEqual(testFuncUser4DB.name, testUser4.name)
      assert.strictEqual(testFuncUser4DB.email, testUser4.email)
      assert.strictEqual(testFuncUser4DB.idkey, testUser4.idkey)
    })
  })

  describe('updateUserById', () => {
    it('should return Error when get not exist user', async () => {
      await assert.rejects(async () => { await updateUserById(testUser5) }, NotFoundError)
    })

    it('should return true when update is success and user is admin', async () => {
      const user5 = await createUser(testUser5)

      const updateUser5 = {
        id: user5.id,
        name: 'updateTestUser5',
        email: 'updateTestUser5@test.com',
        idkey: 'A123435335',
        is_admin: true,
      }
      const updateUser5DB = await updateUserById(updateUser5)
      assert.strictEqual(updateUser5DB.name, updateUser5.name)
      assert.strictEqual(updateUser5DB.email, updateUser5.email)
    })
  })
})
