import { Message, MessageEmbed } from 'discord.js'
import { CommandHelp } from './interfaces'
import { commands as NoteCommands } from './Note'
import { commands as ReminderCommands } from './Reminder'

class CommandsCommand {
  
  async execute (message: Message, args: string[]) {
    const [noteCommands, reminderCommands] = [Object.values(NoteCommands), Object.values(ReminderCommands)]


      const commandStringified = (help: CommandHelp) => `**${help.names[0]}** - ${help.description} | \`DM: ${help.worksAtDM ? 'sim' : 'não'}\``

    const noteCommandsString = `> Comandos de Anotação\n${noteCommands.map(({ help }) => commandStringified(help)).join('\n')}`
    const reminderCommandsString = `> Comandos de Lembrete\n${reminderCommands.map(({ help }) => commandStringified(help)).join('\n')}`

    const embed = new MessageEmbed()
      .setDescription([noteCommandsString, reminderCommandsString].join('\n\n'))

    message.channel.send(embed)
  }

  get help (): CommandHelp {
    const names = ['ajuda', 'help']

    return {
      worksAtDM: true,
      names,
      description: 'Mostra uma lista de comandos',
      examples: [`<prefixo>${names[0]}`]
    }
  }
}

const commandsCommand = new CommandsCommand()

export { commandsCommand }