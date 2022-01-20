import Base from './Base'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import Users from './Users'

export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  NTD = 'NTD',
  GBP = 'GBP',
}

@Entity()
export default class Transactions extends Base {
  @Column('float', { nullable: false })
  amount!: number

  @Column('enum', { enum: CurrencyType, nullable: false })
  currency_type!: string

  @Column('varchar', { length: 255, nullable: true })
  hash!: string

  @ManyToOne(() => Users, user => user.transactions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Users
}
