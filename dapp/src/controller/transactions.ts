import { BaseContext } from 'koa'
import { description, request, summary, tagsAll, body, path } from 'koa-swagger-decorator'
import { postTransaction, getTxByHash } from '../service/txService'
import { sendOk } from '../util/routeHelp'
import { validate, schema } from '../util/validator'

@tagsAll(['Transactions'])
export default class TransactionController {
  @request('post', '/users/transactions')
  @summary('Add new transaction under a user')
  @description('Add a transaction with currency_type and amount to a user by idkey')
  @body({
    idkey: { type: 'string', required: true, description: 'idkey' },
    amount: { type: 'number', required: true, description: 'amount' },
    currency_type: { type: 'string', required: true, description: 'currency type' },
  })
  public static async postTransaction (ctx: BaseContext): Promise<void> {
    validate(ctx.request.body, {
      idkey: schema.taiwanID().required(),
      amount: schema.number().required(),
      currency_type: schema.CurrencyType().required(),
    })
    await postTransaction(ctx.request.body)
    sendOk(ctx)
  }

  @request('get', '/users/transactions/{hash_key}')
  @summary('Get transaction')
  @description('Get transaction by hash key')
  @path({
    hash_key: { type: 'string', required: true, description: 'hash key' },
  })
  public static async getTransaction (ctx: BaseContext): Promise<void> {
    validate(ctx.params, {
      hash_key: schema.string().required(),
    })
    const txExist = await getTxByHash(ctx.params.hash_key)

    sendOk(ctx, { transaction_exists: txExist })
  }
}
