import 'dotenv/config'
import './firebase'
import { Client } from 'discord.js'
import { reminderCommand } from './commands/Reminder'
import { commands as NoteCommands } from './commands/Note'

const client = new Client()

const prefix = process.env.PREFIX ?? '!'

client.on('ready', () => console.log('Ready to work!'))

client.on('message', (message) => {
  if (!message.content.startsWith(prefix.toLowerCase())) return null

  const messageSplitted = message.content.split(' ')
  const commandName = messageSplitted[0].slice(prefix.length)
  const args = messageSplitted.slice(1)

  if (['lembrete'].includes(commandName.toLowerCase())) {
    return reminderCommand.execute(message)
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

client.login(process.env.TOKEN)
