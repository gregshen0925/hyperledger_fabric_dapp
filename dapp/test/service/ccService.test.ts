import assert from 'assert'
import { ChaincodeError } from '../../src/util/errors'
import {
  clearDatabase, clearTables, closeDatabase,
  initDatabase,
} from '../ormconfig'
import { createUser, getUserList } from '../../src/service/usersService'
import FabricClient from '../../src/FabricClient'
import sinon from 'sinon'

let stubInvoke: any
let stubQuery: any

const testUser1 = {
  name: 'testUser1',
  email: 'testUser1@test.com',
  idkey: 'A123456789',
}

describe('chaincodeService.test.ts', () => {
  before(async () => {
    await initDatabase()
  })

  after(async () => {
    await clearDatabase()
    await closeDatabase()
  })

  beforeEach(() => {
    // runs before each test in this block
    stubInvoke = sinon.stub(FabricClient, 'invokeChaincode').resolves(null)
    stubQuery = sinon.stub(FabricClient, 'queryChaincode').resolves(null)
  })

  afterEach(async () => {
    await clearTables()
    stubInvoke.restore()
    stubQuery.restore()
  })

  describe('invokeResult', () => {
    it('should return Error when there is no response from chaincode: invoke', async () => {
      await assert.rejects(async () => { await createUser(testUser1) }, ChaincodeError)
    })
  })

  describe('queryResult', () => {
    it('should return Error when there is no response from chaincode: query', async () => {
      await assert.rejects(async () => { await getUserList() }, ChaincodeError)
    })
  })
})
