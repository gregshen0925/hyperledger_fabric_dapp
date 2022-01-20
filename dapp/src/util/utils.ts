import * as path from 'path'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { UnauthorizedError } from '../util/errors'

export const getRootPath = function (): string {
  const srcPath = path.dirname(require.main?.filename as string)
  return path.resolve(srcPath, '..')
}

export function encodeJwt (value: object): string {
  const token = jwt.sign(
    value,
    config.jwtSecret,
  )
  return token
}

export function decodeJwt (token: string): any {
  try {
    const decoded = jwt.verify(
      token,
      config.jwtSecret,
    )
    return decoded
  } catch (err) {
    throw new UnauthorizedError(err)
  }
}
