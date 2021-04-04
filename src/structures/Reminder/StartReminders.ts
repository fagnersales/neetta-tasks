import { Client } from 'discord.js';
import { RemindersRepositoryProtocol } from '../../repositories/RemindersRepositoryProtocol';
import { handleUserReminders } from './Reminder'

export class StartReminders {
  constructor(
    private client: Client,
    private repository: RemindersRepositoryProtocol
  ) {}

  async execute() {
    const usersReminders = await this.repository.getAll()

    const usersIDs = [...usersReminders.keys()]

    usersIDs.forEach(async (userID) => {
      const user = await this.client.users.fetch(userID)
      const userReminders = usersReminders.get(user.id)
      if (user && userReminders) {
        handleUserReminders.add(user, userReminders)
      }
    })
  }
}