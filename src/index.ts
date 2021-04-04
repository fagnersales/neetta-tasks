import 'dotenv/config'
import './firebase'
import { Client } from 'discord.js'
import { commands as ReminderCommands } from './commands/Reminder'
import { commands as NoteCommands } from './commands/Note'
import { StartReminders } from './structures/Reminder/StartReminders'
import { ReminderRepository } from './repositories/implementations/ReminderRepository/ReminderRepository'
import { RemindersRepository } from './repositories/implementations/RemindersRepository/RemindersRepository'

const client = new Client()

const prefix = process.env.PREFIX ?? '!'

client.on('ready', () => console.log('Ready to work!'))

client.on('message', (message) => {
  if (!message.content.startsWith(prefix.toLowerCase())) return null

  const messageSplitted = message.content.split(' ')
  const commandName = messageSplitted[0].slice(prefix.length)
  const args = messageSplitted.slice(1)

  if (['lembrar', 'lembrete'].includes(commandName.toLowerCase())) {
    if (args.length) {
      return ReminderCommands.read.execute(message, args)
    }
    return ReminderCommands.create.execute(message)
  }

  if (['lembretes'].includes(commandName.toLowerCase())) {
    return ReminderCommands.closests.execute(message, args)
  }
  
  if (['anotar'].includes(commandName.toLowerCase())) {
    return NoteCommands.write.execute(message, args)
  }

  if (['anotação', 'anotaçao', 'anotacao', 'anotações', 'anotaçoes', 'anotacoes'].includes(commandName.toLowerCase())) {
    if (args.length) {
      return NoteCommands.read.execute(message, args)
    } else {
      return NoteCommands.readAll.execute(message)
    }
  }
})

const startReminders = new StartReminders(client, new RemindersRepository())

startReminders.execute()

client.login(process.env.TOKEN)
