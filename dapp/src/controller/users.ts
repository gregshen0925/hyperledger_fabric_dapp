import { BaseContext } from 'koa'
import { description, request, summary, tagsAll, body, path } from 'koa-swagger-decorator'
import { getUserList, createUser, getUserById, updateUserById } from '../service/usersService'
import { sendOk } from '../util/routeHelp'
import { validate, schema } from '../util/validator'

@tagsAll(['Users'])
export default class UserController {
  @request('get', '/users/')
  @summary('Get User List')
  @description('Get all users List.')
  public static async getUserList (ctx: BaseContext): Promise<void> {
    const users = await getUserList()
    sendOk(ctx, { users: users })
  }

  @request('post', '/users/')
  @summary('Create a user')
  @description('Create a user.')
  @body({
    name: { type: 'string', required: true, description: 'user name' },
    email: { type: 'string', required: true, description: 'user email' },
    idkey: { type: 'string', required: true, description: 'user idkey' },
  })
  public static async createUser (ctx: BaseContext): Promise<void> {
    validate(ctx.request.body, {
      name: schema.string().required(),
      email: schema.email().required(),
      idkey: schema.taiwanID().required(),
    })

    await createUser(ctx.request.body)

    sendOk(ctx)
  }

  @request('get', '/users/{id}')
  @summary('Get user data')
  @description('Get user by user id.')
  @path({
    id: { type: 'number', required: true, description: 'user id' },
  })
  public static async getUserById (ctx: BaseContext): Promise<void> {
    validate(ctx.params, {
      id: schema.number().required(),
    })

    const user = await getUserById(ctx.params.id)

    sendOk(ctx, { user: user })
  }

  @request('patch', '/users/{id}')
  @summary('Update user')
  @description('pdate user by id.')
  @path({
    id: { type: 'number', required: true, description: 'user id' },
  })
  @body({
    name: { type: 'string', required: false, description: 'user name' },
    email: { type: 'string', required: false, description: 'user email' },
    idkey: { type: 'string', required: false, description: 'user idkey' },
  })

  public static async updateUserById (ctx: BaseContext): Promise<void> {
    validate(ctx.params, {
      id: schema.number().required(),
    })
    validate(ctx.request.body, {
      name: schema.string(),
      email: schema.email(),
      idkey: schema.taiwanID(),
    })

    await updateUserById({ id: ctx.params.id, ...ctx.request.body })

    sendOk(ctx)
  }
}
