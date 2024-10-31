import env from '@fastify/env'

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      PORT: number
      PG_PORT: string
      PG_USER: string
      PG_PASSWORD: string
      PG_DATABASE: string
      COOKIE_SECRET: string
      COOKIE_NAME: string
      COOKIE_SECURED: boolean
      RATE_LIMIT_MAX: number
      UPLOAD_DIRNAME: string
      UPLOAD_TASKS_DIRNAME: string
      DATABASE_URL: string
    }
  }
}

const schema = {
  type: 'object',
  required: [
    'PG_USER',
    'PG_PASSWORD',
    'PG_DATABASE',
    'COOKIE_SECRET',
    'COOKIE_NAME',
    'COOKIE_SECURED',
    'DATABASE_URL',
  ],
  properties: {
    // Database
    PG_USER: {
      type: 'string',
    },
    PG_PASSWORD: {
      type: 'string',
    },
    PG_DATABASE: {
      type: 'string',
    },
    DATABASE_URL: {
      type: 'string',
    },
    // Security
    COOKIE_SECRET: {
      type: 'string',
    },
    COOKIE_NAME: {
      type: 'string',
    },
    COOKIE_SECURED: {
      type: 'boolean',
      default: true,
    },
    RATE_LIMIT_MAX: {
      type: 'number',
      default: 100, // Put it to 4 in your .env file for tests
    },

    // Files
    UPLOAD_DIRNAME: {
      type: 'string',
      default: 'uploads',
    },
    UPLOAD_TASKS_DIRNAME: {
      type: 'string',
      default: 'tasks',
    },
  },
}

export const autoConfig = {
  // Decorate Fastify instance with `config` key
  // Optional, default: 'config'
  confKey: 'config',

  // Schema to validate
  schema,

  // Needed to read .env in root folder
  dotenv: true,
  // or, pass config options available on dotenv module
  // dotenv: {
  //   path: `${import.meta.dirname}/.env`,
  //   debug: true
  // }
}

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */
export default env
