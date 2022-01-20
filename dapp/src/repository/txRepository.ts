import Users from 'db/entity/Users'
import { EntityRepository, Repository } from 'typeorm'

import Transactions from '../db/entity/Transactions'

import { PostTransactionDbDto } from '../dto/transaction.dto'

@EntityRepository(Transactions)
export default class TxRepository extends Repository<Transactions> {
  public async addTransaction (payload: PostTransactionDbDto, user: Users) {
    const newTransaction = this.create()
    newTransaction.user = user
    newTransaction.amount = payload.amount
    newTransaction.currency_type = payload.currency_type
    newTransaction.hash = payload.hash
    newTransaction.created_at = payload.created_at

    return this.save(newTransaction)
  }

  public async getTxByHash (hash: string) {
    const transaction = await Transactions.findOne({
      where: { hash: hash },
    })
    return transaction
  }
}
