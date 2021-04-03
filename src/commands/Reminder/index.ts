import { Message } from 'discord.js'

class ReminderCommand {
  async execute(message: Message) {
    message.reply('Lembrete...')
  }
}

const reminderCommand = new ReminderCommand()

export { reminderCommand }