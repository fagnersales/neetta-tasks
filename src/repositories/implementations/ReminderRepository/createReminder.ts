import { Reminder } from "../../ReminderRepositoryProtocol";

export const createReminder = (id: string, at: string, what: string, options?: Partial<Reminder['options']>): Reminder => {
  return {
    id,
    at,
    what,
    options: {
      repeatDaily: options?.repeatDaily ?? false
    }
  }
}