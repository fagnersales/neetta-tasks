import { Message, MessageEmbed, MessageReaction } from 'discord.js'
import { Button } from 'discord.js-configurator'
import { NoteRepository } from '../../../repositories/implementations/NoteRepository/NoteRepository'
import moment from 'moment'
moment.locale('pt-br')

class NoteReadCommand {
  async execute(message: Message, args: string[]) {
    const noteRepository = NoteRepository.create(message.author)

    const [id] = args

    const noteOrNull = await noteRepository.read(id)

    if (noteOrNull === null) {
      return message.channel.send(`Não consegui encontrar nenhuma anotação deste id. \`${id}\``)
    }

    const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(noteOrNull.content)
    .setTimestamp(noteOrNull.createdAt)
    .setFooter(`ID: ${noteOrNull.id} | Última edição: ${moment(noteOrNull.editedAt).fromNow()}`)

    const noteMessage = await message.channel.send(embed)

    const buttonData = (emoji: string) => ({ emoji, message: noteMessage, user: message.author })

    const removeButton = new Button(buttonData('🔥'), {
      act: async (messageReaction) => {
        await noteRepository.delete(noteOrNull.id)
        
        removeButton.deactivate()
        messageReaction.message.reactions.removeAll()

        message.channel.send('Anotação removida com sucesso!')
      }
    })

    const editButton = new Button(buttonData('📝'), { act: editButtonAction })
    
    removeButton.activate()
    editButton.activate()

    async function editButtonAction () {
      const askMessage = await message.channel.send('Envie o novo conteúdo desta anotação!')

      const messageCollector = message.channel.createMessageCollector(
        (m: Message) => m.author.equals(message.author) && m.content.length > 1,
        { time: 60000, max: 1 }
      )

      messageCollector.on('collect', (message: Message) => {
          noteRepository.edit(id, message.content)
          .then(note => {
            noteMessage.edit(embed.setDescription(note.content))
          })
        })
        
        messageCollector.on('end', (_collected, reason) => {
          askMessage.delete()

          if (reason === 'limit') {
          return message.channel.send('Anotação editada com sucesso!')
        } else {
          return message.channel.send('Edição cancelada...')
        }
      })
    }

  }
}

const noteReadCommand = new NoteReadCommand()

export { noteReadCommand }