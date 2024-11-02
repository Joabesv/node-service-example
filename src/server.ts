import process from 'node:process'
import closeWithGrace from 'close-with-grace'
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi'
import buildApp from './app.js'
import 'zod-openapi/extend'

/**
 * Do not use NODE_ENV to determine what logger (or any env related feature) to use
 * @see {@link https://www.youtube.com/watch?v=HMM7GJC5E2o}
 */
function getLoggerOptions() {
  // Only if the program is running in an interactive terminal
  if (process.stdout.isTTY) {
    return {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    }
  }

  return { level: process.env.LOG_LEVEL ?? 'silent' }
}

const app = Fastify({
  logger: getLoggerOptions(),
  ajv: {
    customOptions: {
      coerceTypes: 'array', // change type of data to match type keyword
      removeAdditional: 'all', // Remove additional body properties
    },
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

async function init() {
  app.register(fp(buildApp))
  // Delay is the number of milliseconds for the graceful close to finish
  closeWithGrace(
    { delay: Number(process.env.FASTIFY_CLOSE_GRACE_DELAY) ?? 500 },
    async ({ err }) => {
      if (err != null) {
        app.log.error(err)
      }

      await app.close()
    },
  )

  await app.ready()

  try {
    await app.listen({ port: Number(process.env.PORT) ?? 3000 })
  }
  catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

init()
