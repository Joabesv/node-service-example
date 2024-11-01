import { z } from 'zod'

export const TaskStatusEnum = {
  New: 'new',
  InProgress: 'in-progress',
  OnHold: 'on-hold',
  Completed: 'completed',
  Canceled: 'canceled',
  Archived: 'archived',
} as const

export type TaskStatus = typeof TaskStatusEnum[keyof typeof TaskStatusEnum]

export const TaskStatusSchema = z.union([
  z.literal('new'),
  z.literal('in-progress'),
  z.literal('on-hold'),
  z.literal('completed'),
  z.literal('canceled'),
  z.literal('archived'),
])

export const TaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  author_id: z.number(),
  assigned_user_id: z.number().optional(),
  status: TaskStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Task = z.infer<typeof TaskSchema> & {
  filename: string | null
}

export const CreateTaskSchema = z.object({
  name: z.string(),
  author_id: z.number().optional(),
  assigned_user_id: z.number().optional(),
})

export const UpdateTaskSchema = z.object({
  name: z.string(),
  assigned_user_id: z.number().optional(),
})

export const QueryTaskPaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),

  authorId: z.number().optional(),
  status: TaskStatusSchema.optional(),
  order: z.union([z.literal('asc'), z.literal('desc')]).default('desc').optional(),
})

export const TaskPaginationResultSchema = z.object({
  total: z.number().int().min(0).default(0),
  tasks: TaskSchema.array(),
})
