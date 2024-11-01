import type { FastifyInstance } from 'fastify'

export default async function (app: FastifyInstance) {
  app.get('/', ({ session, protocol, hostname }) => {
    return {
      message:
        `Hello ${session.user.username}! See documentation at ${protocol}://${hostname}/documentation`,
    }
  })
}
