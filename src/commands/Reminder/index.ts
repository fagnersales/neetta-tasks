import { reminderClosestsCommand } from './Closests'
import { reminderCreateCommand } from './Create'
import { reminderReadCommand } from './Read'

export const commands = {
  create: reminderCreateCommand,
  read: reminderReadCommand,
  closests: reminderClosestsCommand
}