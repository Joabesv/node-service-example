import type { FastifyInstance } from 'fastify'

export default async function (app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/auth/login')) {
      return
    }

    if (!request.session.user) {
      reply.unauthorized('You must be authenticated to access this route.')
    }
  })
}