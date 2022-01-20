import dotenv from 'dotenv'
import {
  createConnection,
  getConnection,
} from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

dotenv.config({ path: '.env' })

interface BetterConnectionOptions extends PostgresConnectionOptions {
  readonly seeds?: (Function | string)[]
  readonly factories?: (Function | string)[]
}

const ormconfig: BetterConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +(process.env.TYPEORM_PORT as string),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: `${process.env.TYPEORM_DATABASE}_testing`,
  synchronize: (process.env.TYPEORM_SYNCHRONIZE === 'true'),
  logging: false,
  entities: ['src/db/entity/*.ts!(Base.ts)'],
  migrations: ['src/db/migration/*.ts'],
  seeds: ['src/db/seed/*.seed.ts'],
  factories: ['src/db/factories/*.factory.ts'],
}

export const initDatabase = async () => {
  await createConnection(ormconfig)
}

export const clearTables = async () => {
  const entities = getConnection().entityMetadatas
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name)
    await repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`)
  }
}

export const clearTablesWithoutUser = async () => {
  const entities = getConnection().entityMetadatas
  for (const entity of entities) {
    if (entity.tableName === 'users') {
      continue
    }
    const repository = getConnection().getRepository(entity.name)
    await repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`)
  }
}

export const clearDatabase = async () => {
  const entities = getConnection().entityMetadatas
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name)
    await repository.query(`DROP TABLE ${entity.tableName} CASCADE;`)
  }
}

export const closeDatabase = async () => {
  await getConnection().close()
}
