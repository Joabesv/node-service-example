import type { FastifyPluginAsyncZodOpenApi, FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import { z } from 'zod'
import { userRolesTable } from '../models/models.js'
import 'zod-openapi/extend'

export const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
  app.get('/', { schema: {
    tags: ['Root'],
    response: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              message: z.string().openapi({
                description: 'Mensagem padrão',
                example: 'teste',
              }),
            }),
          },
        },
      },
    },
  } satisfies FastifyZodOpenApiSchema }, async () => {
    const aa = await app.drizzle.$count(userRolesTable)
    return { message: 'teste', aa }
  })
}

export default plugin
