import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'
import { z } from 'zod'

export const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
  app.get('/', { schema: {
    response: {
      200: z.object({ message: z.string() }),
    },
  // eslint-disable-next-line prefer-arrow-callback
  } }, function () {
    return { message: 'teste' }
  })
}

export default plugin
