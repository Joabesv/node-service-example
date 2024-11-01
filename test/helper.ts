import type { FastifyInstance, InjectOptions } from 'fastify'
import type { TestContext } from 'node:test'
import path from 'node:path'
import { build as buildApplication } from 'fastify-cli/helper.js'
import { options as serverOptions } from '../src/app.js'

declare module 'fastify' {
  interface FastifyInstance {
    login: typeof login
    injectWithLogin: typeof injectWithLogin
    config: Record<string, string>
  }
}

const AppPath = path.join(import.meta.dirname, '../src/app.ts')

// Fill in this config with all the configurations
// needed for testing the application
export function config() {
  return {
    skipOverride: 'true', // Register our application with fastify-plugin
  }
}

async function login(this: FastifyInstance, username: string) {
  const res = await this.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      username,
      password: 'password123$',
    },
  })

  const cookie = res.cookies.find(
    c => c.name === this.config.COOKIE_NAME,
  )

  if (!cookie) {
    throw new Error('Failed to retrieve session cookie.')
  }

  return cookie.value
}

async function injectWithLogin(
  this: FastifyInstance,
  username: string,
  opts: InjectOptions,
) {
  const cookieValue = await this.login(username)

  opts.cookies = {
    ...opts.cookies,
    [this.config.COOKIE_NAME]: cookieValue,
  }

  return this.inject({
    ...opts,
  })
}

// automatically build and tear down our instance
export async function build(t?: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = (await buildApplication(
    argv,
    config(),
    serverOptions,
  )) as FastifyInstance

  // This is after start, so we can't decorate the instance using `.decorate`
  app.login = login
  app.injectWithLogin = injectWithLogin

  // If we pass the test contest, it will close the app after we are done
  if (t) {
    t.after(() => app.close())
  }

  return app
}