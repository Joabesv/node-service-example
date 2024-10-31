import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fp from 'fastify-plugin'
import { fastifyZodOpenApiTransform, fastifyZodOpenApiTransformObject } from 'fastify-zod-openapi'

export default fp(async (fastify) => {
  /**
   * A Fastify plugin for serving Swagger (OpenAPI v2) or OpenAPI v3 schemas
   *
   * @see {@link https://github.com/fastify/fastify-swagger}
   */
  await fastify.register(fastifySwagger, {
    hideUntagged: true,
    openapi: {
      info: {
        title: 'Fastify Boilerplate API',
        description: 'The official Fastify demo API',
        version: '0.0.0',
      },
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  })

  /**
   * A Fastify plugin for serving Swagger UI.
   *
   * @see {@link https://github.com/fastify/fastify-swagger-ui}
   */
  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })
})
