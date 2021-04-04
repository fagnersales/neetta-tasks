import { User } from 'discord.js'
import ms from 'ms'
import { ReminderRepository } from '../../repositories/implementations/ReminderRepository/ReminderRepository'
import { Reminder } from '../../repositories/ReminderRepositoryProtocol'

const usersReminders = new Map<User, Reminder[]>()

class HandleUserReminders {
  add (user: User, reminders: Reminder | Reminder[]) {
    const userReminders = usersReminders.get(user) ?? []
    if (!Array.isArray(reminders)) reminders = [reminders]

    usersReminders.set(user, [...userReminders, ...reminders ])
  }

  set (user: User, reminders: Reminder[]) {
    usersReminders.set(user, reminders)
  }
}

setInterval(() => {
  const users = [...usersReminders.keys()]

  users.forEach(async user => {
    const reminders = usersReminders.get(user)
    if (reminders) {
      const toRemind = reminders.find(reminder => +reminder.at < Date.now())
      if (toRemind) {
        await user.send(toRemind.what)
        const userReminderRepository = ReminderRepository.create(user)
        await userReminderRepository.remove(toRemind.id)

        if (toRemind.options.repeatDaily) {
          const newReminder = await userReminderRepository.remind(String(+toRemind.at + ms('1d')), toRemind.what, toRemind.options, toRemind.id)
          usersReminders.set(user, (usersReminders.get(user) || [])
            .map((reminder) => reminder.id === toRemind.id ? newReminder: reminder))
        } else {
          usersReminders.set(user, (usersReminders.get(user) || []).filter(reminder => reminder.id !== toRemind.id))
        }
        
      }
    }
  })

}, 1000)

const handleUserReminders = new HandleUserReminders()

export { handleUserReminders }