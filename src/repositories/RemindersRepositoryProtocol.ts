import { User } from 'discord.js'
import { Reminder } from './ReminderRepositoryProtocol'

export interface RemindersRepositoryProtocol {
  getAll(): Promise<Map<User['id'], Reminder[]>>
}