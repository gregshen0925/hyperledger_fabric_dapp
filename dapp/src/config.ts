import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface Config {
  isProdMode: boolean
  port: number
  debugLogging: boolean
  silentLogging: boolean
  jwtSecret: string
  staticServer: boolean
  mspId: string
  identity: string
  channelName: string
  chaincodeId: string
  certPath: string
  privPath: string
  connectionProfilePath: string
}

const isDevMode = process.env.NODE_ENV === 'development'
const isTestMode = process.env.NODE_ENV === 'testing'
const isProdMode = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined

const config: Config = {
  isProdMode,
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  silentLogging: isTestMode,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
  staticServer: process.env.STATIC_SERVER === 'true',
  mspId: 'Org1MSP',
  identity: 'Admin@org1.cathaybc.com',
  channelName: 'cathay',
  chaincodeId: 'chaincode',
  certPath: './metadata/Admin@org1.cathaybc.com-cert.pem',
  privPath: './metadata/priv_sk',
  connectionProfilePath: './metadata/connection-org1.json',
}

export { config }
