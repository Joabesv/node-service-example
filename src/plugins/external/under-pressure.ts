import type { FastifyInstance } from 'fastify'
import fastifyUnderPressure, { type FastifyUnderPressureOptions } from '@fastify/under-pressure'
import { sql } from 'drizzle-orm'
import fp from 'fastify-plugin'
import { usersTable } from '../../models/models.js'

export function autoConfig(app: FastifyInstance): FastifyUnderPressureOptions {
  return {
    maxEventLoopDelay: 1_000,
    maxHeapUsedBytes: 100_000_000,
    maxRssBytes: 1_000_000_000,
    maxEventLoopUtilization: 0.98,
    message: 'The server is under stress, please retry later!',
    retryAfter: 50,
    healthCheck: async () => {
      try {
        await app.drizzle.select({ t: sql`SELECT 1` }).from(usersTable)
        return true
        /* c8 ignore start */
      }
      catch (err) {
        app.log.error(err, 'healthCheck has failed')
        throw new Error('Database connection is not available')
      }
      /* c8 ignore stop */
    },
    healthCheckInterval: 5000,
  }
}

/**
 * A Fastify plugin for mesuring process load and automatically
 * handle of "Service Unavailable"
 *
 * @see {@link https://github.com/fastify/under-pressure}
 *
 * Video on the topic: Do not thrash the event loop
 * @see {@link https://www.youtube.com/watch?v=VI29mUA8n9w}
 */
export default fp(fastifyUnderPressure, {
  // dependencies: ['drizzle'],
})