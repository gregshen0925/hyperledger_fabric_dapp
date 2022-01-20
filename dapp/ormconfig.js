
module.exports = {
  type: process.env.TYPEORM_TYPE || 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || '5432',
  username: process.env.TYPEORM_USERNAME || 'user',
  password: process.env.TYPEORM_PASSWORD || 'pass',
  database: process.env.TYPEORM_DATABASE || 'project',
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  logging: (process.env.TYPEORM_LOGGING === 'true' ? true : process.env.TYPEORM_LOGGING) || false,
  entities: [
    (process.env.NODE_ENV === 'development') ? 'src/db/entity/*.ts!(Base.ts)' : 'dist/db/entity/*.ts!(Base.js)',
  ],
  migrations: [
    (process.env.NODE_ENV === 'development') ? 'src/db/migration/*.ts' : 'dist/db/migration/*.js',
  ],
  seeds: [
    (process.env.NODE_ENV === 'development') ? 'src/db/seed/*.seed.ts' : 'dist/db/seed/*.js',
  ],
  factories: [
    (process.env.NODE_ENV === 'development') ? 'src/db/factories/*.factory.ts' : 'dist/db/seed/*.js',
  ],
  cli: {
    entitiesDir: 'src/db/entity',
    migrationsDir: 'src/db/migration',
  },
}
