import type { DrizzleConfig } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { drizzle, type NodePgClient, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import fp from 'fastify-plugin'
import * as models from '../../models/models.js'
import { CustomDrizzleLogger } from '../../utils/custom-drizzle-logger.js'

type Database = NodePgDatabase<typeof models> & {
  $client: NodePgClient
}

declare module 'fastify' {
  export interface FastifyInstance {
    drizzle: Database
  }
}

export function autoConfig(): DrizzleConfig<typeof models> {
  return {
    casing: 'snake_case',
    logger: new CustomDrizzleLogger(),
    schema: models,
  }
}

export default fp(async (app: FastifyInstance, opts: any) => {
  // @ts-expect-error No big
  app.decorate('drizzle', drizzle(app.config.DATABASE_URL, { ...opts }))
}, { name: 'drizzle' })
