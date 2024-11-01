import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { rolesTable, userRolesTable, usersTable } from '../../../models/models.js'
import { CredentialsSchema } from '../../../schemas/auth.js'
import 'zod-openapi/extend'

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
  app.post('/login', { schema: {
    tags: ['Authentication'],
    body: CredentialsSchema,
    response: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string().optional().openapi({
                description: 'Mensagem de sucesso',
              }),
            }),
          },
        },
      },
      401: {
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string().optional().openapi({
                description: 'Mensagem de erro',
              }),
            }),
          },
        },
      },
    },
  } }, async (request, reply) => {
    const { password, username } = request.body

    return app.drizzle.transaction(async (trx) => {
      const [user] = await trx.select({ username: usersTable.username, password: usersTable.password })
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1)

      if (!user) {
        await reply.badRequest('Invalid username or password')
      }

      const isPasswordValid = await app.compare(password, user.password)
      if (!isPasswordValid) {
        await reply.badRequest('Invalid username or password')
      }

      const roles = await trx.select({ name: rolesTable.name })
        .from(rolesTable)
        .fullJoin(userRolesTable, eq(rolesTable.id, userRolesTable.roleId))
        .fullJoin(usersTable, eq(userRolesTable.userId, usersTable.id))
        .where(eq(usersTable.username, username))

      request.session.user = {
        username,
        // @ts-expect-error Cause i want to
        roles: roles.map(role => role.name),
      }

      await request.session.save()

      return { success: true, message: 'Success' }
    }).catch(() => reply.internalServerError('Transaction Failed.'))
  })
}

export default plugin
