import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import serve from 'koa-static-server'
import winston from 'winston'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import { createConnection } from 'typeorm'
import { config } from './config'
import { errorHandler } from './util/errors'
import { logger, logWithKao } from './util/logger'
import { protectedRouter } from './routes'
import FabricClient from './FabricClient'

logger.info(`Service environment run in: ${process.env.NODE_ENV}`)

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection().then(async () => {
  await FabricClient.connectNetwork()
  logger.info('Fabric-network connected')

  const sessionConfig = {
    key: 'backend.sess',
    maxAge: process.env.NODE_ENV === 'development' ? 2592000000 : 28800000, // it's 1 month in development mode or 2 hours in production mode
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. */
    secure: false, /** true only use on ssl environment */
    renew: true,
  }

  const app = new Koa()

  app.keys = ['TODO paste ssh private key']

  // add static route for frontend app
  if (config.staticServer) {
    app.use(async (ctx, next) => {
      if (!ctx.path.startsWith('/api/')) {
        app.use(serve({ rootDir: 'public', notFoundFile: 'index.html', maxage: 86400000 }))
      }
      await next()
    })
  }

  // use session mechanism to keep login info
  app.use(session(sessionConfig, app))

  // Provides important security headers to make your app more secure
  app.use(helmet())

  // Enable cors with default options
  app.use(cors())

  // Logger middleware -> use winston as logger (logging.ts with config)
  app.use(logWithKao(winston))

  // Enable bodyParser with default options
  app.use(bodyParser())

  // Error handler middleware
  app.use(errorHandler())

  // These routes are protected by the ~~JWT~~ middleware, also include middleware to respond with "Method Not Allowed - 405".
  app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

  // start app server
  app.listen(config.port)

  logger.info(`Server running on port ${config.port}`)

  return app
}).catch(async (error: string) => {
  logger.error('Service init fails')
  logger.error(JSON.stringify(error, null, 2))
})
