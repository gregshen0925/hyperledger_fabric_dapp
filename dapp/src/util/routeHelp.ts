import { BaseContext } from 'koa'
import * as path from 'path'
import { getRootPath } from './utils'
import fs from 'fs'

export const sendOk = (ctx: BaseContext, payload?: any): void => {
  if (!payload) {
    ctx.status = 200
    ctx.body = { status: 'Success' }
    return
  }
  
  ctx.status = 200
  ctx.body = {
    status: 'Success',
    ...payload,
  }
}

export const sendFile = (ctx: BaseContext, filePath: string): void => {
  const rootPath = getRootPath()
  ctx.status = 200
  ctx.attachment(path.join(rootPath, filePath))
  ctx.body = fs.createReadStream(path.join(rootPath, filePath))
}
