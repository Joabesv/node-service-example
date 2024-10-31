import type { FastifyPluginAsyncZodOpenApi, FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import { z } from 'zod'
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
  } satisfies FastifyZodOpenApiSchema }, () => {
    return { message: 'teste' }
  })
}

export default plugin
