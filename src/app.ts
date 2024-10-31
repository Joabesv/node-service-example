import type { FastifyInstance, FastifyPluginOptions, FastifyServerOptions } from 'fastify'
import { join } from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { serializerCompiler, validatorCompiler } from 'fastify-zod-openapi'

export const options = {
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all',
    },
  },
} satisfies FastifyServerOptions

export default async function buildApp(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  opts.skipOverride = undefined

  // This loads all external plugins defined in plugins/external
  // those should be registered first as your custom plugins might depend on them
  await app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'plugins/external'),
    options: { ...opts },
  })

  // This loads all your custom plugins defined in plugins/custom
  // those should be support plugins that are reused
  // through your application
  app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'plugins/custom'),
    options: { ...opts },
  })

  app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'routes'),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  })

  app.setErrorHandler((err, request, _reply) => {
    app.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      'Unhandled error occurred',
    )

    let message = 'Internal Server Error'
    if (err.statusCode && err.statusCode < 500) {
      message = err.message
    }

    return { message }
  })

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 3,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found',
      )

      reply.code(404)

      return { message: 'Not Found' }
    },
  )
}
