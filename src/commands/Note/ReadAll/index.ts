import { Message, MessageEmbed } from 'discord.js'
import { NoteRepository } from '../../../repositories/implementations/NoteRepository/NoteRepository'
import moment from 'moment'
import { CommandHelp } from '../../interfaces'
moment.locale('pt-br')

class NoteReadAllCommand {
  async execute(message: Message) {
    const noteRepository = NoteRepository.create(message.author)

    const notes = await noteRepository.readAll()

    if (notes.length === 0) {
      return message.channel.send('Você ainda não fez nenhuma anotação! Comece uma agora!')
    }

    const stringToCodeBlock = (str: string, code: 'diff' | 'js') => {
      return `\`\`\`${code}\n${str}\`\`\``
    }

    const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(stringToCodeBlock(
        notes
          .sort((noteA, noteB) => noteA.editedAt - noteB.editedAt)
          .map(note => `(${note.id}) - ${note.content.substring(0, 30) + '...'}`).join('\n'), 'diff'))
    .setFooter(`Utilize <prefixo>${this.help.names[0]} (id) para ler todo o conteúdo!`)

    message.channel.send(embed)
  }

  get help(): CommandHelp {
    const names = ['anotações']

    return {
      description: 'Mostra todas as anotações',
      names,
      worksAtDM: true,
      examples: [`<prefixo>${names[0]}`]
    }
  }
}

const noteReadAllCommand = new NoteReadAllCommand()

export { noteReadAllCommand }