import { Message, MessageCollector, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js'
import { Button, DiscordUI } from 'discord.js-configurator'
import moment from 'moment'
import { ReminderRepository } from '../../../repositories/implementations/ReminderRepository/ReminderRepository'
import { Reminder } from '../../../repositories/ReminderRepositoryProtocol'
import { createEditPage } from './ReminderEditUI'
moment.locale('pt-br')

class ReminderReadCommand {
  async execute(message: Message, args: string[]) {
    const reminderRepository = ReminderRepository.create(message.author)

    const [id] = args

    const reminderOrNull = await reminderRepository.get(id)

    if (reminderOrNull === null) {
      return message.channel.send(`Não pude encontrar nenhum lembrete com este id. (\`${id}\`)`)
    }

    const reminder = reminderOrNull
    
    
    const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(reminder.what)
    embed.setFooter(`Acontecerá em: ${moment(Number(reminder.at)).fromNow()}`)
    
    if (+reminder.at < Date.now()) {
      embed.setFooter('Esse lembrete já expirou!')
    } 
    
    const messageSent = await message.channel.send(embed)

    const removeReminderButton = new Button({
      emoji: '🔥',
      message: messageSent,
      user: message.author
    }, {
      act: removeReminderButtonAction
    })
    
    const editPage = createEditPage(reminder)

    const editReminderButton = new Button({
      emoji: '📝',
      message: messageSent,
      user: message.author
    }, {
      act: editReminderButtonAction
    })

    async function removeReminderButtonAction(messageReaction: MessageReaction, _user: User) {
      messageReaction.remove()
      await reminderRepository.remove(id) 
      message.channel.send('Lembrete removido com sucesso!')
    }
    
    removeReminderButton.activate()

    async function editReminderButtonAction(_messageReaction: MessageReaction, _user: User) {
      const discordUI = new DiscordUI({
        channel: message.channel as TextChannel,
        user: message.author,
        pages: [editPage]
      })

      discordUI.on('start', (UIMessage: Message, collector: MessageCollector) => {
        const saveButton = new Button({
          message: UIMessage,
          user: message.author,
          emoji: '✅'
        }, {
          act: saveButtonAction
        })

        saveButton.activate()

        async function saveButtonAction(messageReaction: MessageReaction, _user: User) {
          const [newReminderData] = discordUI.toJSON() as [Reminder]

          const newReminder = { ...reminder, ...newReminderData }

          await reminderRepository.remove(newReminder.id)
          await reminderRepository.remind(newReminder.at, newReminder.what, newReminder.options, newReminder.id)

          messageReaction.message.delete()

          await message.channel.send('Lembrete atualizado com sucesso!')
        }
      })
    }

    editReminderButton.activate()
  }
}

const reminderReadCommand = new ReminderReadCommand()

export { reminderReadCommand }