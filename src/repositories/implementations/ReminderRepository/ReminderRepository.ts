import { User } from 'discord.js'
import { database } from '../../../firebase'
import { Reminder, ReminderRepositoryProtocol } from '../../ReminderRepositoryProtocol'
import { createReminder } from './createReminder'

export class ReminderRepository implements ReminderRepositoryProtocol {
  private reminderReference = (user: User, id: string) => database.ref(`reminders/${user.id}/${id}/`)
  private remindersReference = (user: User) => database.ref(`reminders/${user}`)

  private constructor(
    private user: User
  ) {}

  async remind (at: string, what: string, options?: Partial<Reminder['options']>, inferID?: string): Promise<Reminder> {
    const id = inferID ?? String(Math.floor(Math.random() * 100000))
    const reminder = createReminder(id, at, what, options)

    const reminderReference = this.reminderReference(this.user, id)

    await reminderReference.set(reminder)

    return reminder
  }

  async get (id: string): Promise<Reminder | null> {
    const reminderReference = this.reminderReference(this.user, id)

    const reminder = (await reminderReference.get()).val()

    return reminder ?? null
  }

  async getClosest (): Promise<Reminder | null> {
    const remindersRefenrece = this.remindersReference(this.user)

    const remindersObject = (await remindersRefenrece.get()).val()

    if (!remindersObject) return null

    const reminders = Object.values(remindersObject) as Reminder[]
    
    const closestReminder = reminders.sort((reminderA, reminderB) => (+reminderA.at) - (+reminderB.at))[0]

    return closestReminder
  }
  
  async getClosests (amount: number): Promise<Reminder[]> {
    const remindersRefenrece = this.remindersReference(this.user)
  
    const remindersObject = (await remindersRefenrece.get()).val()
  
    if (!remindersObject) return []
  
    const reminders = Object.values(remindersObject) as Reminder[]

    const closestReminders = reminders.sort((reminderA, reminderB) => (+reminderA.at) - (+reminderB.at))
  
    return closestReminders.slice(0, amount)
  }

  async remove (id: string): Promise<Reminder | null> {
    const reminder = await this.get(id)

    if (reminder) await this.reminderReference(this.user, id).set(null)

    return reminder
  }

  static create(user: User) {
    return new ReminderRepository(user)
  }

}