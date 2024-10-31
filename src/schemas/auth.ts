import { z } from 'zod'

export const CredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export interface Credentials extends z.infer<typeof CredentialsSchema> {}

export interface Auth extends Omit<Credentials, 'password'> {
  roles: string[]
}
