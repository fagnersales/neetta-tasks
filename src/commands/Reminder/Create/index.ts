import { Message, MessageCollector, TextChannel } from 'discord.js'
import { Button, DiscordUI } from 'discord.js-configurator'
import ms from 'ms'
import { ReminderRepository } from '../../../repositories/implementations/ReminderRepository/ReminderRepository'
import { Reminder } from '../../../repositories/ReminderRepositoryProtocol'
import { handleUserReminders } from '../../../structures/Reminder/Reminder'
import { createConfigPage } from './ReminderCreationUI'

class ReminderCreateCommand {
  async execute(message: Message) {
    const reminderRepository = ReminderRepository.create(message.author)

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

          const [configPageJSON] = discordUI.toJSON() as [Reminder]

          const reminder = await reminderRepository.remind(`${Date.now() + ms(configPageJSON.at)}`, configPageJSON.what)

          handleUserReminders.add(message.author, reminder)

          messageReaction.message.channel.send(`Lembrete salvo com sucesso (${reminder.id})!`)
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
}

const reminderCreateCommand = new ReminderCreateCommand()

export { reminderCreateCommand }