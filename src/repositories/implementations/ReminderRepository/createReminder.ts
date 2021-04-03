import { Reminder } from "../../ReminderRepositoryProtocol";

export const createReminder = (id: string, In: number, what: string, options?: Partial<Reminder['options']>): Reminder => {
  return {
    id,
    In: Date.now() + In,
    what,
    options: {
      repeatDaily: options?.repeatDaily ?? false
    }
  }
}