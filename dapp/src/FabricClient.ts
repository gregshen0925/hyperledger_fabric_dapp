import {
  Contract, Gateway,
  GatewayOptions,
  TransientMap, Wallets,
  X509Identity,
} from 'fabric-network'
import fs from 'fs'
import path from 'path'
import { config } from './config'

class FabricClient {
  public static _instance: FabricClient

  public contract!: Contract
  public certificate!: string
  public privateKey!: string
  public connectProfile!: any
  public gateway!: Gateway

  public static get Instance (): FabricClient {
    if (this._instance) return this._instance
    this._instance = new this()
    return this._instance
  }

  public async connectNetwork () {
    try {
      const connectionProfile = path.join(__dirname, config.connectionProfilePath)
      this.connectProfile = JSON.parse(fs.readFileSync(connectionProfile).toString())
      this.certificate = fs.readFileSync(path.join(__dirname, config.certPath)).toString()
      this.privateKey = fs.readFileSync(path.join(__dirname, config.privPath)).toString()
    } catch (err) {
      console.log(err)
      console.error('certificate or privateKey file does not exist')
    }

    const wallet = await Wallets.newInMemoryWallet()
    const x509Identity: X509Identity = {
      credentials: {
        certificate: this.certificate,
        privateKey: this.privateKey,
      },
      mspId: config.mspId,
      type: 'X.509',
    }
    await wallet.put(config.mspId, x509Identity)
    const gatewayOptions: GatewayOptions = {
      identity: config.mspId,
      wallet,
      discovery: {
        enabled: true,
        asLocalhost: true,
      },
    }

    this.gateway = new Gateway()
    await this.gateway.connect(this.connectProfile, gatewayOptions)
    const network = await this.gateway.getNetwork(config.channelName)
    this.contract = network.getContract(config.chaincodeId)
  }

  public closeNetwork () {
    this.gateway.disconnect()
  }

  async queryChaincode (transaction: string, args: string[]) {
    try {
      const queryResult = await this.contract.evaluateTransaction(
        transaction,
        ...args,
      )
      let result = '[]'
      if (queryResult) {
        result = queryResult.toString()
      }
      return JSON.parse(result)
    } catch (error) {
      console.error(
        `Failed to query transaction: "${transaction}" with arguments: "${args}", error: "${error}"`,
      )
    }
  }

  async invokeChaincode (
    transaction: string,
    args: string[],
    transient: TransientMap = {},
  ) {
    try {
      const invokeResult = await this.contract
        .createTransaction(transaction)
        .setTransient(transient)
        .submit(...args)
      let result = '[]'
      if (invokeResult) {
        result = invokeResult.toString()
      }
      return JSON.parse(result)
    } catch (error) {
      console.error(
        `Failed to invoke transaction: "${transaction}" with arguments: "${args}", transient: "${JSON.stringify(transient)}",  error: "${error}"`,
      )
    }
  }
}

export default FabricClient.Instance
