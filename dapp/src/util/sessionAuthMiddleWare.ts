import { BaseContext } from 'koa'
import { SessionError } from './errors'

export const checkSessionAuth = () => async (ctx: BaseContext, next: () => Promise<any>) => {
  if (ctx.session && ctx.session.login) {
    await next()
  } else {
    throw new SessionError('Session error')
  }
}
