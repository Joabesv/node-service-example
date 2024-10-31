import type { FastifyStaticOptions } from '@fastify/static'
import type { FastifyInstance } from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import fastifyStatic from '@fastify/static'

export function autoConfig(app: FastifyInstance): FastifyStaticOptions {
  const dirPath = path.join(import.meta.dirname, '../../..', app.config.UPLOAD_DIRNAME)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }

  const dirTasksPath = path.join(dirPath, app.config.UPLOAD_TASKS_DIRNAME)
  if (!fs.existsSync(dirTasksPath)) {
    fs.mkdirSync(dirTasksPath)
  }

  return {
    root: path.join(import.meta.dirname, '../../..'),
    prefix: `/${app.config.UPLOAD_DIRNAME}`,
  }
}

/**
 * This plugins allows to serve static files as fast as possible.
 *
 * @see {@link https://github.com/fastify/fastify-static}
 */
export default fastifyStatic
