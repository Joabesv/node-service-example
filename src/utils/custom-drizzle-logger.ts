import type { Logger } from 'drizzle-orm'
import { pino } from 'pino'

export class CustomDrizzleLogger implements Logger {
  private readonly logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  })

  logQuery(query: string, params: unknown[]): void {
    this.logger.info(`${query} | Params: ${JSON.stringify(params)}`)
  }
}
