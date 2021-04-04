import { Message } from 'discord.js'
import { ReminderRepository } from '../../../repositories/implementations/ReminderRepository/ReminderRepository'
import moment from 'moment'
moment.locale('pt-br')

export class ReminderClosestsCommand {
  async execute(message: Message, args: string[]) {
    const reminderRepository = ReminderRepository.create(message.author)

    const amount = args[0]

    const closestReminders = await reminderRepository.getClosests(amount ? +amount : 10)

    if (!closestReminders.length) {
      return message.channel.send('Não há lembretes ainda...')
    }

    const resolvedClosestReminders = closestReminders
      .sort((a, b) => (+a.at) - (+b.at))
      .map((reminder) => `${reminder.id}) ${reminder.what} \`${moment(+reminder.at).fromNow()}\``)

    message.channel.send(resolvedClosestReminders.join('\n'))
  }
}

const reminderClosestsCommand = new ReminderClosestsCommand()

export { reminderClosestsCommand }