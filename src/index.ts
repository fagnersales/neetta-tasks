import 'dotenv/config'
import './firebase'
import { Client } from 'discord.js'
import { commands as ReminderCommands } from './commands/Reminder'
import { commands as NoteCommands } from './commands/Note'
import { commandsCommand } from './commands'
import { StartReminders } from './structures/Reminder/StartReminders'
import { RemindersRepository } from './repositories/implementations/RemindersRepository/RemindersRepository'

const client = new Client()

const prefix = process.env.PREFIX ?? '!'

client.on('ready', () => console.log('Ready to work!'))

client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith(prefix.toLowerCase())) return null

  const messageSplitted = message.content.split(' ')
  const commandName = messageSplitted[0].slice(prefix.length)
  const args = messageSplitted.slice(1)

  if (commandsCommand.help.names.includes(commandName.toLowerCase())) {
    return commandsCommand.execute(message, args)
  }

  if (ReminderCommands.create.help.names.includes(commandName.toLowerCase())) {
    return ReminderCommands.create.execute(message)
  }

  if (ReminderCommands.read.help.names.includes(commandName.toLowerCase())) {
      return ReminderCommands.read.execute(message, args)
  }

  if (ReminderCommands.closests.help.names.includes(commandName.toLowerCase())) {
    return ReminderCommands.closests.execute(message, args)
  }
  
  if (NoteCommands.write.help.names.includes(commandName.toLowerCase())) {
    return NoteCommands.write.execute(message, args)
  }

  if (NoteCommands.read.help.names.includes(commandName.toLowerCase())) {
    return NoteCommands.read.execute(message, args)
  }

  if (NoteCommands.readAll.help.names.includes(commandName.toLowerCase())) {
    return NoteCommands.readAll.execute(message)
  }
})

const startReminders = new StartReminders(client, new RemindersRepository())

startReminders.execute()

client.login(process.env.TOKEN)
