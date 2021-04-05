import { Message, MessageCollector, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js'
import { Button, DiscordUI } from 'discord.js-configurator'
import moment from 'moment'
import ms from 'ms'
import { ReminderRepository } from '../../../repositories/implementations/ReminderRepository/ReminderRepository'
import { Reminder } from '../../../repositories/ReminderRepositoryProtocol'
import { CommandHelp } from '../../interfaces'
import { createEditPage } from './ReminderEditUI'
moment.locale('pt-br')

class ReminderReadCommand {
  async execute(message: Message, args: string[]) {
    const reminderRepository = ReminderRepository.create(message.author)

    const [id] = args

    if (!id) {
      return message.channel.send('Você precisa informar o ID do lembrete a ser lido!')
    }

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

          const newReminder: Reminder = {
            id: reminder.id,
            options: {
              repeatDaily: newReminderData.options?.repeatDaily ?? reminder.options?.repeatDaily
            },
            at: newReminderData.at ? String(Date.now() + (ms(newReminderData.at))) : reminder.at,
            what: newReminderData.what ?? reminder.what
          }

          await reminderRepository.remove(newReminder.id)
          await reminderRepository.remind(newReminder.at, newReminder.what, newReminder.options, newReminder.id)

          messageReaction.message.delete()

          await message.channel.send('Lembrete atualizado com sucesso!')
        }
      })
    }

    editReminderButton.activate()
  }

  get help(): CommandHelp {
    const names = ['lembrete']

    return {
      description: 'Mostra um lembrete com mais detalhes a partir do ID',
      names,
      worksAtDM: true,
      examples: [`<prefixo>${names[0]} 44220`]
    }
  }
}

const reminderReadCommand = new ReminderReadCommand()

export { reminderReadCommand }