import { Context } from 'koa'
import { logger } from './logger'

export class AppError extends Error {
  constructor (message: any) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    logger.error(this.name + ': ' + this.message)
  }
}

export class ParamsError extends AppError {}
export class UnauthorizedError extends AppError {}
export class ForbiddenError extends AppError {}
export class NotFoundError extends AppError {}
export class DatabaseError extends AppError {}
export class SessionError extends AppError {}
export class ChaincodeError extends AppError {}

export const errorHandler = () => {
  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    try {
      await next()
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        ctx.status = 200
      } else if (error instanceof AppError) {
        ctx.status = 200
      } else {
        ctx.status = error.statusCode || error.status || 500
        logger.error(JSON.stringify(error))
      }
      ctx.body = {
        status: error.name,
        message: error.message,
      }
    }
  }
}
