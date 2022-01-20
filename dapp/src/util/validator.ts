import Joi from '@hapi/joi'
import { ParamsError } from './errors'
import { CurrencyType } from '../db/entity/Transactions'

export function validate (target: object, schema: object) {
  const { error } = Joi.object(schema).validate(target)
  if (error) {
    throw new ParamsError(error.details[0].message)
  }
}

export const schema = {
  timestamp: () => Joi.date().timestamp(),
  arrayNumber: () => Joi.array().items(Joi.number()),
  object: () => Joi.object(),
  array: () => Joi.array(),
  boolean: () => Joi.boolean(),
  string: () => Joi.string(),
  number: () => Joi.number().min(0).max(999999999),
  integer: () => Joi.number().integer(),
  email: () => Joi.string().email(),
  isoString: () => Joi.date().iso(),
  CurrencyType: () => Joi.string().valid(CurrencyType.USD, CurrencyType.EUR, CurrencyType.JPY, CurrencyType.NTD, CurrencyType.GBP),
  taiwanID: () => Joi.string().regex(/^[A-Z]{1}[1-2]{1}[0-9]{8}$/),
}
