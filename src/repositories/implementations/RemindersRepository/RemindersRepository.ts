import { User } from 'discord.js'
import { database } from '../../../firebase'
import { Reminder } from '../../ReminderRepositoryProtocol'
import { RemindersRepositoryProtocol } from '../../RemindersRepositoryProtocol'

export class RemindersRepository implements RemindersRepositoryProtocol {
  private remindersReference = database.ref('reminders/')

  async getAll(): Promise<Map<User['id'], Reminder[]>> {
    const remindersSnapshot = await this.remindersReference.get()

    const remindersObject = remindersSnapshot.val()

    const usersReminders = new Map<User['id'], Reminder[]>()

    for (const [userID, reminders] of Object.entries((remindersObject || {}) as Record<string, Reminder>)) {
      usersReminders.set(userID, Object.values(reminders))
    }

    return usersReminders
  }
}