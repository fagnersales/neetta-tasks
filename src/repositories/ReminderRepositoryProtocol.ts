export interface Reminder {
  id: string
  what: string
  In: number
  options: {
    repeatDaily: boolean
  }
}

export interface ReminderRepositoryProtocol {
  /** Saves a reminder at the database */
  remind: (In: number, what: string, options?: Partial<Reminder['options']>, inferID?: string) => Promise<Reminder>

  /** Gets a reminder by its ID */
  get: (id: string) => Promise<Reminder | null>

  /** Gets the most closest reminder */
  getClosest: () => Promise<Reminder | null>

  /** Gets an amount of the most closests reminders */
  getClosests: (amount: number) => Promise<Reminder[]>

  /** Removes a reminder by its id and return what was found */
  remove: (id: string) => Promise<Reminder | null>
}