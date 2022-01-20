import Base from './Base'
import { Entity, Column, OneToMany } from 'typeorm'
import Transactions from './Transactions'

@Entity()
export default class Users extends Base {
  @Column('varchar', { unique: true, length: 255, nullable: false })
  idkey!: string

  @Column('varchar', { length: 100, nullable: false })
  name!: string

  @Column('varchar', { unique: true, length: 100, nullable: false })
  email!: string

  @OneToMany(() => Transactions, transactions => transactions.user, { cascade: ['insert', 'soft-remove', 'update'] })
  transactions!: Transactions[]
}
