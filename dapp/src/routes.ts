import { SwaggerRouter } from 'koa-swagger-decorator'
import path from 'path'

const protectedRouter = new SwaggerRouter({ prefix: '/api/v1' })

// Swagger endpoint
protectedRouter.swagger({
  title: 'Protected API',
  description: 'description',
  version: '0.0.1',
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(path.join(__dirname, 'controller/'))

export { protectedRouter }
