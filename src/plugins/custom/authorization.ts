import type { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyRequest {
    verifyAccess: typeof verifyAccess
    isModerator: typeof isModerator
    isAdmin: typeof isAdmin
  }
}

function verifyAccess(this: FastifyRequest, reply: FastifyReply, role: string) {
  if (!this.session.user.roles.includes(role)) {
    reply.status(403).send('You are not authorized to access this resource.')
  }
}

async function isModerator(this: FastifyRequest, reply: FastifyReply) {
  this.verifyAccess(reply, 'moderator')
}

async function isAdmin(this: FastifyRequest, reply: FastifyReply) {
  this.verifyAccess(reply, 'admin')
}

/**
 * The use of fastify-plugin is required to be able
 * to export the decorators to the outer scope
 *
 * @see {@link https://github.com/fastify/fastify-plugin}
 */
export default fp(
  async (app) => {
    app.decorateRequest('verifyAccess', verifyAccess)
    app.decorateRequest('isModerator', isModerator)
    app.decorateRequest('isAdmin', isAdmin)
  },
  { name: 'authorization' },
)
