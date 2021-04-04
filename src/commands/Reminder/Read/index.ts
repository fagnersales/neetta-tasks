import { Message, MessageEmbed } from 'discord.js'
import moment from 'moment'
import { ReminderRepository } from '../../../repositories/implementations/ReminderRepository/ReminderRepository'
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
    
    message.channel.send(embed)
  }
}

const reminderReadCommand = new ReminderReadCommand()

export { reminderReadCommand }