# Miller

## Init development

1. make .env file `cp .example.env .env`
1. creat local database `docker-compose up -d`

## Run in development

1. `npm install`
1. `npm run start:dev`

## Use typeorm for development

1. set `TYPEORM_SYNCHRONIZE=true` in `.env` file.
1. set `TYPEORM_LOGGING=true` in `.env` file if need.

## Use typeorm migration for release

1. delete all table in releaser environment.
1. run `npm run migration:run` to run migration.
1. run `npm run migration:generate <VersionName>` to generate migration file with script.
1. commit and push the migration file that you created.
1. Congratulations! well done!

## Another typeorm commands in develop

1. run `NODE_ENV=development npm run entity:create <FileName>` to create empty entity.
1. run `NODE_ENV=development npm run migration:create <FileName>` to create empty migration.
1. run `NODE_ENV=development npm run migration:drop` to drop all table.
1. run `NODE_ENV=development npm run migration:seed` to seed test data into table.

## Build docker images for development in gitlab runner

1. run `docker build -f DockerfileDev .` to build dockerfile Dev.