import { Message, MessageCollector, TextChannel } from 'discord.js'
import { NoteRepository } from '../../../repositories/implementations/NoteRepository/NoteRepository'
import { DiscordUI, Item, Page, Button } from 'discord.js-configurator'
import { createConfigPage } from './NoteCreationUI'
import { CommandHelp } from '../../interfaces'

class NoteWriteCommand {
  async execute(message: Message, args: string[]) {
    const noteRepository = NoteRepository.create(message.author)

    const configPage = createConfigPage()

    const discordUI = new DiscordUI({
      channel: message.channel as TextChannel,
      user: message.author,
      pages: [configPage]
    })

    discordUI.on('start', (UIMessage: Message, collector: MessageCollector) => {
      const UIButtonsData = (emoji: Button['emoji']) => ({
        user: message.author,
        message: UIMessage,
        emoji
      })

      const fulfilledButton = new Button(UIButtonsData('✅'), {
        activated: false,
        act: async (messageReaction) => {
          collector.stop('saved')
          messageReaction.message.delete()

          const [configPageJSON] = discordUI.toJSON()

          const note = await noteRepository.write(configPageJSON.content)

          messageReaction.message.channel.send(`Anotação salva com sucesso (${note.id})!`)
        }
      })

      discordUI
        .on('UIFulfilled', () => {
          fulfilledButton.activate()
        })
        .on('UINotFulfilledAnymore', () => {
          fulfilledButton.deactivate()
        })
    })
  }

  get help(): CommandHelp {
    const names = ['anotar']

    return {
      description: 'Cria uma nova anotação',
      names,
      worksAtDM: true,
      examples: [`<prefixo>${names[0]}`]
    }
  }
}

const noteWriteCommand = new NoteWriteCommand()

export { noteWriteCommand }