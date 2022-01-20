import { Factory, Seeder } from 'typeorm-seeding'
import Users from '../entity/Users'

export default class CreateUsers implements Seeder {
  public async run (factory: Factory): Promise<void> {
    await Users.create({
      email: 'admin@admin.com',
      name: 'Admin Seeder',
      idkey: 'H124969808',
    }).save().catch(() => { return true })

    await factory(Users)().createMany(10)
    await factory(Users)(true).createMany(10)
  }
}
