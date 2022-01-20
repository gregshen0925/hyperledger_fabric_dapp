import { Context } from 'koa'
import { config } from '../config'
import { transports, format, createLogger } from 'winston'
// logger.error('logger console error')     // 0
// logger.warn('logger console warn')       // 1
// logger.info('logger console info')       // 2
// logger.http('logger console http')       // 3
// logger.verbose('logger console verbose') // 4
// logger.debug('logger console debug')     // 5
// logger.silly('logger console debug')     // 6

const transportsConfig = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(
      info => `${info.timestamp} - ${info.level}: ${info.message}`,
    ),
  ),
}

const logger = createLogger({
  level: config.debugLogging ? 'debug' : config.isProdMode ? 'warn' : 'info',
  silent: config.silentLogging,
  transports: [
    // - Write to all logs with specified level to console.
    new transports.Console(transportsConfig),
  ],
})

const logWithKao = (winstonInstance: any): any => {
  winstonInstance.configure({
    level: config.debugLogging ? 'debug' : config.isProdMode ? 'warn' : 'info',
    transports: [
      //
      // - Write all logs error (and below) to `error.log`.
      // new transports.File({ filename: 'error.log', level: 'error' }),
      //
      // - Write to all logs with specified level to console.
      new transports.Console(transportsConfig),
    ],
  })

  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    const start = new Date().getTime()

    // koa used. This could be change by user, don't trust it. If need real ip, try to get it form tcp layer.
    const remoteAddr = ctx.ips.length > 0 ? ctx.ips[0] : ctx.ip
    const remoteUser = ctx.ips.length > 0 ? ctx.ips : ''
    const contentLength = ctx.req.headers['content-length'] || 0
    const httpReferer = ctx.req.headers.referer || ''
    const userAgent = ctx.req.headers['user-agent'] || ''

    await next()

    const ms = new Date().getTime() - start

    let logLevel: string
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400) {
      logLevel = 'warn'
    } else {
      logLevel = 'info'
    }

    const resMsg = `${remoteAddr} - ${remoteUser} - "${ctx.method} ${ctx.originalUrl} ${ctx.req.httpVersion} ${ctx.status} ${contentLength} "-"${httpReferer}" "${userAgent}" ${ms}ms`
    // const resMsg = `${ctx.ip} ${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`

    winstonInstance.log(logLevel, resMsg)
  }
}

export { logger, logWithKao }
