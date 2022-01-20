import Faker from 'faker'
import { define } from 'typeorm-seeding'
import Users from '../entity/Users'

define(Users, (faker: typeof Faker, is_delete: boolean = false) => {
  const user = new Users()
  user.email = faker.internet.email()
  user.name = `${faker.name.lastName()} ${faker.name.firstName()}`
  user.deleted_at = is_delete ? faker.date.past() : undefined

  return user
})
