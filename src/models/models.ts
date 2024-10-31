import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial().primaryKey(),
  username: varchar({ length: 200 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const tasksTable = pgTable('tasks', {
  id: serial().primaryKey(),
  name: varchar({ length: 200 }).notNull(),
  authorId: serial().references(() => usersTable.id).notNull(),
  assignedUserId: serial().references(() => usersTable.id).notNull(),
  filename: varchar({ length: 255 }),
  status: varchar({ length: 50 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const userTasksTable = pgTable('userTasks', {
  userId: serial().references(() => usersTable.id).notNull(),
  taskId: serial().references(() => tasksTable.id).notNull(),
})

export const rolesTable = pgTable('roles', {
  id: serial().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
})

export const userRolesTable = pgTable('userRoles', {
  id: serial().primaryKey(),
  userId: serial().references(() => usersTable.id).notNull(),
  roleId: serial().references(() => rolesTable.id).notNull(),
})
