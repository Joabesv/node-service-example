import env, { type FastifyEnvOptions } from '@fastify/env'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

declare module 'fastify' {
  export interface FastifyInstance {
    config: z.infer<typeof configSchema>
  }
}

const configSchema = z.object({
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DATABASE: z.string(),
  COOKIE_SECRET: z.string(),
  COOKIE_NAME: z.string(),
  COOKIE_SECURED: z.coerce.boolean().default(false),
  RATE_LIMIT_MAX: z.coerce.number().default(4),
  UPLOAD_DIRNAME: z.string().default('uploads'),
  UPLOAD_TASKS_DIRNAME: z.string().default('tasks'),
})

const schema = zodToJsonSchema(configSchema)

export const autoConfig = {
  schema,
  dotenv: true,
  confKey: 'config',
} satisfies FastifyEnvOptions

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */
export default env
